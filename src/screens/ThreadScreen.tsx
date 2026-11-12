import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";
import { SendHorizontal } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/navigation/navigation.type";
import BasicNavigationLayout from "../components/BasicNavigationLayout";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { BookingData, BookingStatus, Message } from "@/src/api/messages";
import { BookingResponse } from "@/src/api/bookings";
import {
  toMessageBookingStatus,
  useConfirmBooking,
  useDeclineBooking,
} from "@/src/queries/useBookings";
import DeclineBookingSheet from "@/src/components/molecules/sheets/DeclineBookingSheet";
import { queryClient } from "@/src/lib/query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/src/types/common/error.interface";
import {
  useMarkThreadRead,
  useThread,
  useThreadMessages,
  useSendMessage,
} from "@/src/queries/useMessages";
import { subscribe } from "@/src/lib/realtime";
import { useChatStore } from "@/src/stores/useChatStore";
import { participantName } from "@/src/utils/participant";
import { formatTime } from "@/src/utils/date";
import { useErrorToast } from "@/src/hooks/useErrorToast";
import { useUserStore } from "@/src/stores/useUserStore";
import { UserRole } from "@/src/types/api/user/user.enum";
import BookingCard, { BrokenBookingCard } from "@/src/components/molecules/BookingCard";
import { cardStyle } from "@/src/constants/styles";
import { colors } from "@/src/constants/colors";

type Props = NativeStackScreenProps<RootStackParamList, "thread">;

const MAX_LENGTH = 4000;

// Booking cards are rendered by ThreadScreen, which knows each booking's newest message
const MessageItem = ({ item, isOwn }: { item: Message; isOwn: boolean }) => {
  const sentAt = formatTime(new Date(item.createdAt));

  // System lines and types this client doesn't know yet
  if (item.type !== "TEXT" || item.senderType !== "USER") {
    return (
      <View className="items-center px-6">
        <Text size="xs" className="text-center" style={{ color: colors.textMuted }}>
          {item.content}
        </Text>
      </View>
    );
  }

  // react-native View (not gluestack Box): on web Box is a plain <div>, which
  // drops RN-only style props like paddingHorizontal and shadow*
  return (
    <View
      style={{
        alignSelf: isOwn ? "flex-end" : "flex-start",
        alignItems: isOwn ? "flex-end" : "flex-start",
        maxWidth: "80%",
      }}
    >
      <View
        style={{
          ...cardStyle,
          // Short text keeps the time on its line; text that wraps fills the
          // row and pushes the time onto its own line
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "flex-end",
          columnGap: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 14,
          // Flat corner on the sender's side, like a speech tail
          borderBottomRightRadius: isOwn ? 4 : 14,
          borderBottomLeftRadius: isOwn ? 14 : 4,
          backgroundColor: isOwn ? colors.primary : colors.white,
        }}
      >
        <Text
          size="sm"
          style={{ color: isOwn ? colors.white : colors.black, maxWidth: "100%" }}
        >
          {item.content}
        </Text>
        {/* leading-none: the size class's line height would make this box
            taller than the message line and lift the time off the bottom */}
        <Text
          size="2xs"
          className="leading-none"
          style={{
            color: isOwn ? colors.textOnPrimaryMuted : colors.textMuted,
            fontSize: 8,
            marginLeft: "auto",
          }}
        >
          {sentAt}
        </Text>
      </View>
    </View>
  );
};

const ThreadScreen = ({ route }: Props) => {
  const { threadId } = route.params;
  const thread = useThread(threadId);
  const user = useUserStore((s) => s.user);
  const isProfessional = user?.role === UserRole.PROFESSIONAL;
  const otherName = thread ? participantName(thread.otherParticipant) : "";
  const { showError } = useErrorToast();
  const [content, setContent] = useState("");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useThreadMessages(threadId);
  const { mutate: send, isPending } = useSendMessage(threadId);
  const { mutate: markRead } = useMarkThreadRead(threadId);
  const { mutate: confirmBooking, isPending: isConfirming } = useConfirmBooking();
  const { mutate: declineBooking, isPending: isDeclining } = useDeclineBooking();
  const [decliningBookingId, setDecliningBookingId] = useState<string | null>(null);
  // Status from the confirm/decline response, shown until the matching
  // BOOKING message arrives over the socket (outbox/inbox crons take ~1–2 min)
  const [optimisticBookings, setOptimisticBookings] = useState<
    Record<string, { status: BookingStatus; reason: string | null }>
  >({});
  const setFocusedThreadId = useChatStore((s) => s.setFocusedThreadId);

  // While on screen: mark read on focus and on every incoming message;
  // useRealtime skips the unread increment for the focused thread
  useFocusEffect(
    useCallback(() => {
      setFocusedThreadId(threadId);
      markRead();
      const unsubscribe = subscribe((frame) => {
        if (
          frame.type === "message.created" &&
          frame.threadId === threadId &&
          frame.message.senderExternalId !==
            useUserStore.getState().user?.externalId
        ) {
          markRead();
        }
      });
      return () => {
        unsubscribe();
        setFocusedThreadId(null);
      };
    }, [threadId, markRead, setFocusedThreadId]),
  );

  // A message pushed into the first page shifts the server offsets, so later
  // pages can repeat one; keep the first occurrence.
  const messages = useMemo(() => {
    const seen = new Set<string>();
    return (data?.pages.flatMap((p) => p.content) ?? []).filter((m) =>
      seen.has(m.id) ? false : (seen.add(m.id), true),
    );
  }, [data]);

  // bookingId → id of its newest BOOKING message. Messages are newest-first, so
  // the first one seen wins; new socket messages land in the cache and re-run this.
  const latestBookingMessageIds = useMemo(() => {
    const latest = new Map<string, string>();
    for (const m of messages) {
      if (m.type === "BOOKING" && m.data && m.bookingId && !latest.has(m.bookingId)) {
        latest.set(m.bookingId, m.id);
      }
    }
    return latest;
  }, [messages]);

  const clearOptimistic = (bookingId: string) =>
    setOptimisticBookings(({ [bookingId]: _, ...rest }) => rest);

  const bookingCallbacks = (bookingId: string) => ({
    onSuccess: (booking: BookingResponse) => {
      const status = toMessageBookingStatus(booking.status);
      if (status) {
        setOptimisticBookings((prev) => ({
          ...prev,
          [bookingId]: { status, reason: booking.declineReason },
        }));
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // Already answered elsewhere: show the real state
      if (error.response?.status === 409) {
        clearOptimistic(bookingId);
        queryClient.invalidateQueries({ queryKey: ["messages", threadId] });
      }
      showError(error, {
        "booking.status.invalid": "This booking was already answered.",
        "booking.forbidden": "Only the booked professional can answer this booking.",
        "booking.not.found": "This booking no longer exists.",
      });
    },
  });

  const renderBooking = (
    item: Message & { type: "BOOKING"; data: BookingData; bookingId: string },
  ) => {
    const bookingId = item.bookingId;
    const isLatest = latestBookingMessageIds.get(bookingId) === item.id;
    const optimistic =
      isLatest && item.data.status === "REQUESTED"
        ? optimisticBookings[bookingId]
        : undefined;
    const data = optimistic ? { ...item.data, ...optimistic } : item.data;
    // Older cards of the booking are faded. The professional keeps Confirm/
    // Decline on every request card (disabled once a newer card exists) and on
    // the newest declined one; both sides get Reschedule once it's confirmed.
    const showAnswerButtons =
      isProfessional &&
      data.status !== "CONFIRMED" &&
      (isLatest || data.status === "REQUESTED");
    const actions = showAnswerButtons
      ? {
          disabled: !isLatest || isConfirming || isDeclining,
          onConfirm: () => confirmBooking(bookingId, bookingCallbacks(bookingId)),
          onDecline: () => setDecliningBookingId(bookingId),
        }
      : undefined;

    return (
      <BookingCard
        data={data}
        viewer={{ isProfessional, otherName }}
        faded={!isLatest}
        actions={actions}
        showReschedule={isLatest && data.status === "CONFIRMED"}
      />
    );
  };

  const canSend = content.trim().length > 0 && !isPending;

  const handleSend = () => {
    if (!canSend) return;
    send(content.trim(), {
      onSuccess: () => setContent(""),
      onError: (error) =>
        showError(error, {
          "service.unavailable": "Messaging is temporarily unavailable",
        }),
    });
  };

  return (
    <BasicNavigationLayout
      title={thread ? participantName(thread.otherParticipant) : ""}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {isLoading ? (
          <Spinner size="large" color={colors.black} style={{ marginTop: 32 }} />
        ) : (
          <FlatList
            inverted
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 8, paddingVertical: 12, paddingHorizontal: 4 }}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isFetchingNextPage ? <Spinner color={colors.black} /> : null
            }
            renderItem={({ item }) =>
              // Old booking messages were migrated to SYSTEM TEXT without data
              item.type === "BOOKING" ||
              (item.senderType === "SYSTEM" && item.bookingId) ? (
                item.type === "BOOKING" && item.data && item.bookingId ? (
                  renderBooking({ ...item, data: item.data, bookingId: item.bookingId })
                ) : (
                  <BrokenBookingCard />
                )
              ) : (
                <MessageItem
                  item={item}
                  isOwn={item.senderExternalId === user?.externalId}
                />
              )
            }
          />
        )}
        <HStack space="sm" className="items-center py-2">
          <Input
            className="flex-1"
            size="md"
            style={{ borderColor: colors.primary }}
          >
            <InputField
              placeholder="Write a message"
              value={content}
              onChangeText={setContent}
              maxLength={MAX_LENGTH}
              multiline
              // Enter sends (Shift+Enter for a new line on web); on mobile the
              // return key becomes "send"
              returnKeyType="send"
              submitBehavior="submit"
              // Web sends from onKeyPress only, so Enter can't send twice
              onSubmitEditing={Platform.OS === "web" ? undefined : handleSend}
              onKeyPress={(e) => {
                const { key, shiftKey } = e.nativeEvent as {
                  key: string;
                  shiftKey?: boolean;
                };
                if (Platform.OS === "web" && key === "Enter" && !shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </Input>
          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            accessibilityLabel="Send message"
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primary,
              opacity: canSend ? 1 : 0.4,
            }}
          >
            <SendHorizontal size={20} color={colors.white} />
          </Pressable>
        </HStack>
      </KeyboardAvoidingView>
      <DeclineBookingSheet
        isOpen={decliningBookingId !== null}
        onClose={() => setDecliningBookingId(null)}
        onDecline={(reason) => {
          const bookingId = decliningBookingId!;
          setDecliningBookingId(null);
          declineBooking({ bookingId, reason }, bookingCallbacks(bookingId));
        }}
      />
    </BasicNavigationLayout>
  );
};

export default ThreadScreen;

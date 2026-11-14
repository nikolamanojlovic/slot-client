import { useState } from "react";
import { FlatList, View } from "react-native";
import BasicNavigationLayout from "../components/BasicNavigationLayout";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Badge, BadgeText } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  getBookingThreads,
  getThreads,
  MessageThreadResponse,
  type BookingData,
  type BookingFlowState,
} from "@/src/api/messages";
import {
  useCancelBooking,
  useConfirmBooking,
  useDeclineBooking,
} from "@/src/queries/useBookings";
import RescheduleBookingDrawer from "@/src/components/molecules/RescheduleBookingDrawer";
import BookingCard from "@/src/components/molecules/BookingCard";
import BookingReasonModal from "@/src/components/molecules/BookingReasonModal";
import { useErrorToast } from "@/src/hooks/useErrorToast";
import { queryClient } from "@/src/lib/query";
import type { ErrorResponse } from "@/src/types/common/error.interface";
import { cardStyle } from "@/src/constants/styles";
import { colors } from "@/src/constants/colors";
import { participantName } from "@/src/utils/participant";
import { bookingMessageText } from "@/src/utils/bookingMessage";
import { useUserStore } from "@/src/stores/useUserStore";
import { UserRole } from "@/src/types/api/user/user.enum";
import type { Message } from "@/src/api/messages";
import { formatDate, formatTime } from "@/src/utils/date";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import Chip from "@/src/components/atoms/Chip";

// Today: time only; earlier: date only
const formatThreadDate = (iso: string) => {
  const date = new Date(iso);
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday ? formatTime(date) : formatDate(date);
};

// Booking messages read as a sentence for this viewer; anything else shows its content
const previewText = (message: Message, isProfessional: boolean, otherName: string) =>
  (message.type === "BOOKING" && message.data
    ? bookingMessageText(message.data, { isProfessional, otherName })
    : null) ?? message.content;

const ThreadItem = ({ item }: { item: MessageThreadResponse }) => {
  const navigation = useAppNavigation();
  const isProfessional = useUserStore((s) => s.user?.role === UserRole.PROFESSIONAL);
  const name = participantName(item.otherParticipant);
  const hasUnread = item.unreadCount > 0;

  return (
    <Pressable
      style={{ width: "100%" }}
      onPress={() => navigation.navigate("thread", { threadId: item.id })}
    >
      <View
        style={{
          ...cardStyle,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Avatar size="md" style={{ backgroundColor: colors.primary, flexShrink: 0 }}>
          <AvatarFallbackText style={{ color: colors.white }}>
            {name}
          </AvatarFallbackText>
        </Avatar>

        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Text
            size="sm"
            className="font-bold"
            style={{ color: colors.primary }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
          {item.lastMessage && (
            <Text
              size="xs"
              style={{ color: hasUnread ? colors.text : colors.textMuted }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {previewText(item.lastMessage, isProfessional, name)}
            </Text>
          )}
        </View>

        <View
          style={{
            alignSelf: "stretch",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexShrink: 0,
            gap: 6,
          }}
        >
          <Text
            size="2xs"
            style={{ color: hasUnread ? colors.primary : colors.textMuted }}
          >
            {formatThreadDate(item.lastMessage?.createdAt ?? item.createdAt)}
          </Text>
          {hasUnread ? (
            <Badge
              size="sm"
              className="rounded-full"
              style={{
                backgroundColor: colors.primary,
                minWidth: 22,
                justifyContent: "center",
              }}
            >
              <BadgeText style={{ color: colors.white }}>
                {item.unreadCount > 99 ? "99+" : item.unreadCount}
              </BadgeText>
            </Badge>
          ) : (
            <View />
          )}
        </View>
      </View>
    </Pressable>
  );
};

// Every booking state except REQUESTED, for the Other tab
const OTHER_STATES: BookingFlowState[] = ["CONFIRMED", "RESCHEDULED", "DECLINED", "CANCELLED"];

type BookingMessage = Message & { type: "BOOKING"; data: BookingData; bookingId: string };

const isBookingMessage = (m: Message | null | undefined): m is BookingMessage =>
  m?.type === "BOOKING" && !!m.data && !!m.bookingId;

// One list row: a booking's current card, or the conversation's normal row
// when the row has no card
interface BookingRow {
  key: string;
  thread: MessageThreadResponse;
  card: BookingMessage | null;
}

// getBookingThreads already returns one row per booking, with its card in
// message, so two requests from one client are two rows
const toBookingRows = (rows: MessageThreadResponse[]): BookingRow[] =>
  rows.map((row) =>
    isBookingMessage(row.message)
      ? { key: row.message.id, thread: row, card: row.message }
      : { key: row.id, thread: row, card: null },
  );

// The Other tab: each booking's current card, with Reschedule/Cancel on a
// confirmed or rescheduled one, as in the chat. Tapping a card opens the
// conversation.
const OtherBookingList = ({ threads }: { threads: MessageThreadResponse[] }) => {
  const navigation = useAppNavigation();
  const { showError } = useErrorToast();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState<{
    bookingId: string;
    basedOnMessageId: string;
  } | null>(null);
  // Cancelled bookings stay faded with disabled buttons until the list
  // refetches with their next card (~1–2 min, once it reaches messaging)
  const [cancelled, setCancelled] = useState<Record<string, true>>({});
  // A reschedule's new card, shown in place of the card it was made from
  // until the real one arrives
  const [rescheduled, setRescheduled] = useState<
    Record<string, { basedOnMessageId: string; data: Partial<BookingData> }>
  >({});

  return (
    <>
      <FlatList
        data={toBookingRows(threads)}
        keyExtractor={(row) => row.key}
        contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
        renderItem={({ item: { thread, card } }) => {
          if (!card) return <ThreadItem item={thread} />;
          const { bookingId } = card;
          const isCancelled = !!cancelled[bookingId];
          const early = rescheduled[bookingId];
          const data =
            early?.basedOnMessageId === card.id ? { ...card.data, ...early.data } : card.data;
          const isConfirmed = data.status === "CONFIRMED" || data.status === "RESCHEDULED";
          return (
            <Pressable onPress={() => navigation.navigate("thread", { threadId: thread.id })}>
              <BookingCard
                data={data}
                faded={isCancelled}
                content={card.content}
                viewer={{ isProfessional: true, otherName: participantName(thread.otherParticipant) }}
                confirmedActions={
                  isConfirmed
                    ? {
                        disabled: isCancelled || isCancelling,
                        onReschedule: () =>
                          setRescheduling({ bookingId, basedOnMessageId: card.id }),
                        onCancel: () => setCancellingBookingId(bookingId),
                      }
                    : undefined
                }
              />
            </Pressable>
          );
        }}
      />
      <BookingReasonModal
        mode={cancellingBookingId ? "cancel" : null}
        onClose={() => setCancellingBookingId(null)}
        onSubmit={(reason) => {
          const bookingId = cancellingBookingId!;
          setCancellingBookingId(null);
          cancelBooking(
            { bookingId, reason: reason! },
            {
              onSuccess: () => {
                setCancelled((prev) => ({ ...prev, [bookingId]: true }));
                queryClient.invalidateQueries({ queryKey: ["threads"] });
              },
              onError: (error: AxiosError<ErrorResponse>) => {
                if (error.response?.status === 409) {
                  queryClient.invalidateQueries({ queryKey: ["threads"] });
                }
                showError(error, {
                  "booking.status.invalid": "This booking has already changed.",
                  "booking.forbidden": "Only the booked professional can do this.",
                  "booking.not.found": "This booking no longer exists.",
                });
              },
            },
          );
        }}
      />
      <RescheduleBookingDrawer
        bookingId={rescheduling?.bookingId ?? null}
        onClose={() => setRescheduling(null)}
        onRescheduled={(booking, previous) => {
          const { basedOnMessageId } = rescheduling!;
          setRescheduling(null);
          setRescheduled((prev) => ({
            ...prev,
            [booking.id]: {
              basedOnMessageId,
              data: {
                status: "RESCHEDULED",
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                reason: booking.rescheduleReason,
                previousDate: previous.date,
                previousStartTime: previous.startTime,
                previousEndTime: previous.endTime,
              },
            },
          }));
          queryClient.invalidateQueries({ queryKey: ["threads"] });
        }}
        onStale={() => {
          setRescheduling(null);
          queryClient.invalidateQueries({ queryKey: ["threads"] });
        }}
      />
    </>
  );
};

// The Requests tab: every waiting request as its booking card, answered
// right here. Tapping a card opens the conversation.
const RequestList = ({ threads }: { threads: MessageThreadResponse[] }) => {
  const navigation = useAppNavigation();
  const { showError } = useErrorToast();
  const { mutate: confirmBooking, isPending: isConfirming } = useConfirmBooking();
  const { mutate: declineBooking, isPending: isDeclining } = useDeclineBooking();
  const [decliningBookingId, setDecliningBookingId] = useState<string | null>(null);
  // Answered requests stay faded with disabled buttons until the list
  // refetches without them (~1–2 min, once the next card reaches messaging)
  const [answered, setAnswered] = useState<Record<string, true>>({});

  const callbacks = (bookingId: string) => ({
    onSuccess: () => {
      setAnswered((prev) => ({ ...prev, [bookingId]: true }));
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.status === 409) {
        queryClient.invalidateQueries({ queryKey: ["threads"] });
      }
      showError(error, {
        "booking.status.invalid": "This booking has already changed.",
        "booking.forbidden": "Only the booked professional can do this.",
        "booking.not.found": "This booking no longer exists.",
      });
    },
  });

  return (
    <>
      <FlatList
        data={toBookingRows(threads)}
        keyExtractor={(row) => row.key}
        contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
        renderItem={({ item: { thread, card } }) => {
          if (!card) return <ThreadItem item={thread} />;
          const { bookingId } = card;
          const isAnswered = !!answered[bookingId];
          return (
            <Pressable
              onPress={() => navigation.navigate("thread", { threadId: thread.id })}
            >
              <BookingCard
                data={card.data}
                faded={isAnswered}
                content={card.content}
                viewer={{ isProfessional: true, otherName: participantName(thread.otherParticipant) }}
                actions={{
                  disabled: isAnswered || isConfirming || isDeclining,
                  onConfirm: () => confirmBooking(bookingId, callbacks(bookingId)),
                  onDecline: () => setDecliningBookingId(bookingId),
                }}
              />
            </Pressable>
          );
        }}
      />
      <BookingReasonModal
        mode={decliningBookingId ? "decline" : null}
        onClose={() => setDecliningBookingId(null)}
        onSubmit={(reason) => {
          const bookingId = decliningBookingId!;
          setDecliningBookingId(null);
          declineBooking({ bookingId, reason }, callbacks(bookingId));
        }}
      />
    </>
  );
};

type Tab = "messages" | "requests" | "other";

const MessagesScreen = () => {
  const isProfessional = useUserStore((s) => s.user?.role === UserRole.PROFESSIONAL);
  // Only professionals get requests to answer
  const [tab, setTab] = useState<Tab>("messages");
  const showRequests = isProfessional && tab === "requests";
  const showOther = isProfessional && tab === "other";

  // ["threads"] is the inbox the socket updates in place; the booking lists
  // and count sit under it so invalidating ["threads"] refetches them all
  const inbox = useQuery({
    queryKey: ["threads"],
    queryFn: () => getThreads(),
    enabled: !showRequests && !showOther,
  });
  const requests = useQuery({
    queryKey: ["threads", "requests"],
    queryFn: () => getBookingThreads(["REQUESTED"]),
    enabled: showRequests,
  });
  const other = useQuery({
    queryKey: ["threads", "other"],
    queryFn: () => getBookingThreads(OTHER_STATES),
    enabled: showOther,
  });
  // The Requests chip's number: bookings with a request waiting (one row each), from
  // totalElements. size=1 because Spring treats size=0 as the default of 10.
  const { data: requestCount } = useQuery({
    queryKey: ["threads", "requests", "count"],
    queryFn: () => getBookingThreads(["REQUESTED"], 0, 1),
    select: (page) => page.totalElements,
    enabled: isProfessional,
  });
  const { data, isLoading } = showRequests ? requests : showOther ? other : inbox;

  return (
    <BasicNavigationLayout title="Messages" showBack={false}>
      {isProfessional && (
        <View style={{ flexDirection: "row", gap: 8, paddingVertical: 8 }}>
          <Chip
            label="Messages"
            selected={tab === "messages"}
            onPress={() => setTab("messages")}
          />
          <Chip
            label="Requests"
            count={requestCount}
            selected={tab === "requests"}
            onPress={() => setTab("requests")}
          />
          <Chip
            label="Other"
            selected={tab === "other"}
            onPress={() => setTab("other")}
          />
        </View>
      )}
      {isLoading ? (
        <Spinner size="large" color={colors.black} style={{ marginTop: 32 }} />
      ) : !data?.content.length ? (
        <Box className="flex-1 items-center justify-center">
          <Text style={{ color: colors.textMuted, fontSize: 15 }}>
            {showRequests
              ? "No requests waiting"
              : showOther
                ? "No other bookings"
                : "No messages yet"}
          </Text>
        </Box>
      ) : showRequests ? (
        <RequestList threads={data.content} />
      ) : showOther ? (
        <OtherBookingList threads={data.content} />
      ) : (
        <FlatList
          data={data.content}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <ThreadItem item={item} />
          )}
        />
      )}
    </BasicNavigationLayout>
  );
};

export default MessagesScreen;

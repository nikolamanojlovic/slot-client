import { FlatList, View } from "react-native";
import BasicNavigationLayout from "../components/BasicNavigationLayout";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Badge, BadgeText } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getThreads, MessageThreadResponse } from "@/src/api/messages";
import { cardStyle } from "@/src/constants/styles";
import { colors } from "@/src/constants/colors";
import { participantName } from "@/src/utils/participant";
import { bookingMessageText } from "@/src/utils/bookingMessage";
import { useUserStore } from "@/src/stores/useUserStore";
import { UserRole } from "@/src/types/api/user/user.enum";
import type { Message } from "@/src/api/messages";
import { formatDate, formatTime } from "@/src/utils/date";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";

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

const MessagesScreen = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["threads"],
    queryFn: () => getThreads(),
  });

  return (
    <BasicNavigationLayout title="Messages" showBack={false}>
      {isLoading ? (
        <Spinner size="large" color={colors.black} style={{ marginTop: 32 }} />
      ) : !data?.content.length ? (
        <Box className="flex-1 items-center justify-center">
          <Text style={{ color: colors.textMuted, fontSize: 15 }}>No messages yet</Text>
        </Box>
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

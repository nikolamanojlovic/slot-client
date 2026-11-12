import { View } from "react-native";
import { MessageCircle } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Badge, BadgeText } from "@/components/ui/badge";
import { useUnreadCount } from "@/src/queries/useMessages";
import { useUserStore } from "@/src/stores/useUserStore";
import { colors } from "@/src/constants/colors";

const MessagesTabIcon = () => {
  const user = useUserStore((s) => s.user);
  const { data } = useUnreadCount(!!user);
  const unread = user ? (data?.unreadThreads ?? 0) : 0;

  return (
    <View>
      <Icon as={MessageCircle} size="xl" color={colors.primary} />
      {unread > 0 && (
        <Badge
          size="sm"
          className="rounded-full"
          style={{
            position: "absolute",
            top: -6,
            right: -10,
            minWidth: 18,
            paddingHorizontal: 4,
            justifyContent: "center",
            backgroundColor: colors.primary,
          }}
        >
          <BadgeText style={{ color: colors.white, fontSize: 10 }}>
            {unread > 99 ? "99+" : unread}
          </BadgeText>
        </Badge>
      )}
    </View>
  );
};

export default MessagesTabIcon;

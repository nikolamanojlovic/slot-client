import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import { useUserStore } from "@/src/stores/useUserStore";
import { useNavigationState } from "@react-navigation/native";
import {
  CalendarDays,
  MessageCircle,
  Search,
  Store,
  User,
  UserX,
} from "lucide-react";
import { Pressable, View } from "react-native";

const ACTIVE_COLOR = "#06392F";

const NavItem = ({
  active,
  onPress,
  children,
}: {
  active?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}) => (
  <Pressable
    className="flex-1 flex items-center justify-center"
    onPress={onPress}
  >
    <View
      style={{
        position: "absolute",
        top: -2,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: active ? ACTIVE_COLOR : "transparent",
      }}
    />
    {children}
  </Pressable>
);

const NavigationBar = () => {
  const navigation = useAppNavigation();
  const currentRoute = useNavigationState(
    (state) => state.routes[state.index].name,
  );

  const user = useUserStore((s) => s.user);

  return (
    <Box className="w-full position-fixed bottom-0 min-h-[50px] align-items-center bg-transparent">
      <HStack className="w-full h-full">
        <NavItem
          active={currentRoute === "home"}
          onPress={() => navigation.navigate("home")}
        >
          <Icon as={Store} size="xl" color="#06392F" />
        </NavItem>
        <NavItem
          active={currentRoute === "explore"}
          onPress={() => navigation.navigate("explore")}
        >
          <Icon as={Search} size="xl" color="#06392F" />
        </NavItem>
        <NavItem>
          <Icon as={CalendarDays} size="xl" color="#06392F" />
        </NavItem>
        <NavItem>
          <Icon as={MessageCircle} size="xl" color="#06392F" />
        </NavItem>
        <NavItem
          active={currentRoute === "profile"}
          onPress={() => navigation.navigate("profile")}
        >
          {!!user ? (
            <Icon as={User} size="xl" color="#06392F" />
          ) : (
            <Icon as={UserX} size="xl" color="#06392F" />
          )}
        </NavItem>
      </HStack>
    </Box>
  );
};

export default NavigationBar;

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import MessagesTabIcon from "@/src/components/atoms/MessagesTabIcon";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import { useNavigationState } from "@react-navigation/native";
import {
  CalendarDays,
  HandHelping,
  Store,
  User,
} from "lucide-react";
import { Pressable, View } from "react-native";
import { colors } from "@/src/constants/colors";

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
        backgroundColor: active ? colors.primary : "transparent",
      }}
    />
    {children}
  </Pressable>
);

const ProfessionalNavigationBar = () => {
  const navigation = useAppNavigation();
  const currentRoute = useNavigationState(
    (state) => state.routes[state.index].name,
  );

  return (
    <Box className="w-full position-fixed bottom-0 min-h-[50px] align-items-center bg-transparent">
      <HStack className="w-full h-full">
        <NavItem
          active={currentRoute === "home"}
          onPress={() => navigation.navigate("home")}
        >
          <Icon as={Store} size="xl" color={colors.primary} />
        </NavItem>
        <NavItem
          active={currentRoute === "professional-expertises"}
          onPress={() => navigation.navigate("professional-expertises")}
        >
          <Icon as={HandHelping} size="xl" color={colors.primary} />
        </NavItem>
        <NavItem>
          <Icon as={CalendarDays} size="xl" color={colors.primary} />
        </NavItem>
        <NavItem
          active={currentRoute === "messages"}
          onPress={() => navigation.navigate("messages")}
        >
          <MessagesTabIcon />
        </NavItem>
        <NavItem
          active={currentRoute === "profile"}
          onPress={() => navigation.navigate("profile")}
        >
          <Icon as={User} size="xl" color={colors.primary} />
        </NavItem>
      </HStack>
    </Box>
  );
};

export default ProfessionalNavigationBar;

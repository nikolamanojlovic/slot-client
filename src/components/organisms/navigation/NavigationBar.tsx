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
import { Pressable } from "react-native";

const NavigationBar = () => {
  const styleActive = "bg-gray-500";

  const navigation = useAppNavigation();
  const currentRoute = useNavigationState(
    (state) => state.routes[state.index].name
  );

  const user = useUserStore((s) => s.user);

  return (
    <Box className="w-full position-fixed bottom-0 min-h-[50px] align-items-center bg-black text-white">
      <HStack className="w-full h-full">
        <Pressable
          className={`flex-1 flex items-center justify-center ${
            currentRoute === "home" ? styleActive : ""
          }`}
          onPress={() => navigation.navigate("home")}
        >
          <Icon as={Store} size="xl" />
        </Pressable>
        <Pressable
          className={`flex-1 flex items-center justify-center ${
            currentRoute === "explore" ? styleActive : ""
          }`}
          onPress={() => navigation.navigate("explore")}
        >
          <Icon as={Search} size="xl" />
        </Pressable>
        <Pressable className="flex-1 flex items-center justify-center">
          <Icon as={CalendarDays} size="xl" />
        </Pressable>
        <Pressable className="flex-1 flex items-center justify-center">
          <Icon as={MessageCircle} size="xl" />
        </Pressable>
        <Pressable
          className={`flex-1 flex items-center justify-center ${
            currentRoute === "profile" ? styleActive : ""
          }`}
          onPress={() => navigation.navigate("profile")}
        >
          {!!user ? (
            <Icon as={User} size="xl" />
          ) : (
            <Icon as={UserX} size="xl" />
          )}
        </Pressable>
      </HStack>
    </Box>
  );
};

export default NavigationBar;

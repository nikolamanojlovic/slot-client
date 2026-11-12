import { View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import NavigationBar from "./organisms/navigation/NavigationBar";
import ProfessionalNavigationBar from "./organisms/navigation/ProfessionalNavigationBar";
import { useUserStore } from "@/src/stores/useUserStore";
import { UserRole } from "@/src/types/api/user/user.enum";
import { H4 } from "@expo/html-elements";
import { ChevronLeft } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";

interface Props {
  title: string;
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

const BasicNavigationLayout = ({ title, children, showBack = true, onBack, rightAction }: Props) => {
  const user = useUserStore((s) => s.user);
  const isProfessional = user?.role === UserRole.PROFESSIONAL;
  const navigation = useAppNavigation();

  return (
    <View className="flex-1">
      <View>
        <View className="flex-row items-center px-3 pt-2 pb-1">
          {showBack ? (
            <Pressable
              onPress={() => onBack ? onBack() : navigation.goBack()}
              style={{
                width: 32,
                height: 32,
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={20} color={colors.primary} />
            </Pressable>
          ) : (
            <View style={{ width: 32, height: 32 }} />
          )}
          <H4
            className="flex-1 text-center m-0 p-0"
            style={{ color: colors.primary }}
          >
            {title}
          </H4>
          <View style={{ width: 32, alignItems: "flex-end", justifyContent: "center" }}>
            {rightAction}
          </View>
        </View>
      </View>
      <View className="flex-1 pr-3 pl-3">
        {children}
        {/* Content fades out as it scrolls up under the header */}
        <LinearGradient
          colors={[colors.screen, colors.screenTransparent]}
          pointerEvents="none"
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 16 }}
        />
      </View>
      {isProfessional ? <ProfessionalNavigationBar /> : <NavigationBar />}
    </View>
  );
};

export default BasicNavigationLayout;

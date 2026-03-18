import { View } from "react-native";
import NavigationBar from "./organisms/navigation/NavigationBar";
import ProfessionalNavigationBar from "./organisms/navigation/ProfessionalNavigationBar";
import { useUserStore } from "@/src/stores/useUserStore";
import { UserRole } from "@/src/types/api/user/user.enum";

const BasicLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useUserStore((s) => s.user);
  const isProfessional = user?.role === UserRole.PROFESSIONAL;

  return (
    <View className="flex-1">
      <View className="flex-1 pr-3 pl-3">{children}</View>
      {isProfessional ? <ProfessionalNavigationBar /> : <NavigationBar />}
    </View>
  );
};

export default BasicLayout;

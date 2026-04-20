import { View } from "react-native";
import { Image } from "@/components/ui/image";
import NavigationBar from "./organisms/navigation/NavigationBar";
import ProfessionalNavigationBar from "./organisms/navigation/ProfessionalNavigationBar";
import { useUserStore } from "@/src/stores/useUserStore";
import { UserRole } from "@/src/types/api/user/user.enum";

interface Props {
  bannerUri: string;
  bannerAlt?: string;
  children: React.ReactNode;
}

const BannerLayout = ({ bannerUri, bannerAlt = "", children }: Props) => {
  const user = useUserStore((s) => s.user);
  const isProfessional = user?.role === UserRole.PROFESSIONAL;

  return (
    <View className="flex-1">
      <View className="flex-1">
        <Image
          source={{ uri: bannerUri }}
          alt={bannerAlt}
          className="w-full h-[180px]"
        />
        <View
          className="flex-1 pr-3 pl-3"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          {children}
        </View>
      </View>
      {isProfessional ? <ProfessionalNavigationBar /> : <NavigationBar />}
    </View>
  );
};

export default BannerLayout;

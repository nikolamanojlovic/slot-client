import { View, Pressable } from "react-native";
import { Image } from "@/components/ui/image";
import NavigationBar from "./organisms/navigation/NavigationBar";
import ProfessionalNavigationBar from "./organisms/navigation/ProfessionalNavigationBar";
import { useUserStore } from "@/src/stores/useUserStore";
import { UserRole } from "@/src/types/api/user/user.enum";
import { ChevronLeft } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";

interface Props {
  bannerUri: string;
  bannerAlt?: string;
  children: React.ReactNode;
}

const BannerLayout = ({ bannerUri, bannerAlt = "", children }: Props) => {
  const user = useUserStore((s) => s.user);
  const isProfessional = user?.role === UserRole.PROFESSIONAL;
  const navigation = useAppNavigation();

  return (
    <View className="flex-1">
      <View className="flex-1">
        <View>
          <Image
            source={{ uri: bannerUri }}
            alt={bannerAlt}
            className="w-full h-[180px]"
          />
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              top: 10,
              left: 12,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#ffffff",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={20} color={colors.primary} />
          </Pressable>
        </View>
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

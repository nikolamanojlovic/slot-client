import BasicNavigationLayout from "../components/BasicNavigationLayout";
import { HStack } from "@/components/ui/hstack";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { useUserStore } from "@/src/stores/useUserStore";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { LogOut } from "lucide-react-native";
import { useAuth } from "@/src/queries/useAuth";
import ProfessionalProfileItems from "@/src/components/molecules/ProfessionalProfileItems";

const ProfessionalProfileScreen = () => {
  const { signOut } = useAuth();
  const user = useUserStore((s) => s.user);
  return (
    <BasicNavigationLayout title="Profile" showBack={false}>
      <VStack space="md" className="mt-3">
        <HStack className="w-full justify-between mt-3 mb-3">
          <Avatar size="md">
            <AvatarFallbackText>
              {`${user?.firstName[0]}${user?.lastName[0]}`}
            </AvatarFallbackText>
            <AvatarImage source={undefined} />
          </Avatar>
          <VStack className="ml-3 h-full flex-1 justify-center">
            <Text>{`${user?.firstName} ${user?.lastName}`}</Text>
            <Text size="xs">{user?.email}</Text>
          </VStack>
          <Pressable className="m-auto" onPress={() => signOut()}>
            <Icon as={LogOut} size="xl" />
          </Pressable>
        </HStack>
        <ProfessionalProfileItems />
      </VStack>
    </BasicNavigationLayout>
  );
};

export default ProfessionalProfileScreen;

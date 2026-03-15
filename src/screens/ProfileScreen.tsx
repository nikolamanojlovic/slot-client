import { View } from "react-native";
import BasicLayout from "../components/BasicLayout";
import { Heading } from "@/components/ui/heading";
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
import { LogOut } from "lucide-react";
import { useAuth } from "@/src/queries/useAuth";

const ProfileScreen = () => {
  const { signOut } = useAuth();

  const user = useUserStore((s) => s.user);

  return (
    <BasicLayout>
      <Heading size="2xl" className="text-left underline mt-3 mb-3">
        Profile
      </Heading>
      <HStack className="w-full justify-between">
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
    </BasicLayout>
  );
};

export default ProfileScreen;

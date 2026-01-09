import React from "react";
import { View } from "react-native";
import BasicLayout from "../BasicLayout";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { useUserStore } from "@/src/stores/useUserStore";

const HomePage = () => {
  const user = useUserStore((s) => s.user);

  return (
    <BasicLayout>
      <View className="flex-1 pr-3 pl-3">
        <VStack>
          <Heading size="2xl" className="text-left underline mt-3 mb-3">
            {user ? "Hello, " + user.firstName : "Hello"}
          </Heading>
        </VStack>
      </View>
    </BasicLayout>
  );
};

export default HomePage;

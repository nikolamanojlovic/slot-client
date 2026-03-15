import React from "react";
import { View } from "react-native";
import BasicLayout from "../components/BasicLayout";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { useUserStore } from "@/src/stores/useUserStore";

const HomeScreen = () => {
  const user = useUserStore((s) => s.user);

  return (
    <BasicLayout>
      <VStack>
        <Heading size="2xl" className="text-left underline mt-3 mb-3">
          {user ? "Hello, " + user.firstName : "Hello"}
        </Heading>
      </VStack>
    </BasicLayout>
  );
};

export default HomeScreen;

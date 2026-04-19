import React from "react";
import BasicLayout from "../components/BasicLayout";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import AiBookingFab from "@/src/components/molecules/AiBookingFab";
import { useUserStore } from "@/src/stores/useUserStore";
import { UserRole } from "@/src/types/api/user/user.enum";

const HomeScreen = () => {
  const user = useUserStore((s) => s.user);

  return (
    <BasicLayout>
      <VStack>
        <Heading size="2xl" className="text-left text-primary-500 mt-3 mb-3">
          {user ? "👋 Hi, " + user.firstName + "!" : "👋 Hi!"}
        </Heading>
      </VStack>
      {user?.role !== UserRole.PROFESSIONAL && <AiBookingFab className="mb-2" />}
    </BasicLayout>
  );
};

export default HomeScreen;

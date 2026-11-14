import React from "react";
import BasicLayout from "../components/BasicLayout";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import TodayBookings from "@/src/components/molecules/TodayBookings";
import AISchedulingFab from "@/src/components/molecules/AISchedulingFab";
import { useUserStore } from "@/src/stores/useUserStore";
import { UserRole } from "@/src/types/api/user/user.enum";
import { colors } from "@/src/constants/colors";

const HomeScreen = () => {
  const user = useUserStore((s) => s.user);

  return (
    <BasicLayout>
      <VStack>
        <Heading
        size="2xl"
        className="text-left mt-3 mb-3"
        style={{ color: colors.primary }}
      >
          {user ? "👋 Hi, " + user.firstName + "!" : "👋 Hi!"}
        </Heading>
        <TodayBookings />
      </VStack>
      {user?.role !== UserRole.PROFESSIONAL && <AISchedulingFab className="mb-2" />}
    </BasicLayout>
  );
};

export default HomeScreen;

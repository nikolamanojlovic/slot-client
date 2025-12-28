import AnonymousCallout from "../../organisms/callouts/AnonymousCallout";
import React, { useState } from "react";
import AnonymousHeader from "../../organisms/headers/AnonymousHeader";
import { AuthActionSheet } from "../../organisms/forms/auth/AuthActionSheet";
import { View } from "react-native";
import BasicLayout from "../BasicLayout";

const HomePage = () => {
  const [isAuthSheetOpen, setIsAuthSheetOpen] = useState(false);

  return (
    <BasicLayout>
      <View className="flex-1">
        <AnonymousHeader setIsAuthSheetOpen={setIsAuthSheetOpen} />
        <AnonymousCallout />
        <AuthActionSheet
          isAuthSheetOpen={isAuthSheetOpen}
          setIsAuthSheetOpen={setIsAuthSheetOpen}
        />
      </View>
    </BasicLayout>
  );
};

export default HomePage;

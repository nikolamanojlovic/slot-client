import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/lib/query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomePage from "./src/components/pages/common/HomePage";
import ExplorePage from "./src/components/pages/common/ExplorePage";
import AuthenticationPage from "./src/components/pages/common/AuthenticationPage";
import { useAuthListener } from "./src/hooks/useAuthListener";
import { useUserStore } from "./src/stores/useUserStore";
import { View } from "react-native";
import ProfilePage from "./src/components/pages/common/ProfilePage";

const Stack = createNativeStackNavigator();

export default function App() {
  useAuthListener();

  const user = useUserStore((s) => s.user);

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="light">
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="home" component={HomePage} />
              <Stack.Screen name="explore" component={ExplorePage} />
              {!!user ? (
                <Stack.Screen name="profile" component={ProfilePage} />
              ) : (
                <Stack.Screen name="profile" component={AuthenticationPage} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}

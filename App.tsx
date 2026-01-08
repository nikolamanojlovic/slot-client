import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/lib/query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomePage from "./src/components/pages/common/HomePage";
import CategoryPage from "./src/components/pages/common/CategoryPage";
import AuthenticationPage from "./src/components/pages/common/AuthenticationPage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="light">
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="home" component={HomePage} />
              <Stack.Screen name="category" component={CategoryPage} />
              <Stack.Screen name="profile" component={AuthenticationPage} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}

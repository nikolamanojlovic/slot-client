import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/lib/query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./src/types/navigation/navigation.type";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/screens/HomeScreen";
import ExploreScreen from "./src/screens/ExploreScreen";
import ExpertiseScreen from "./src/screens/ExpertiseScreen";
import ProfessionalExpertisesScreen from "./src/screens/ProfessionalExpertisesScreen";
import AuthenticationScreen from "./src/screens/AuthenticationScreen";
import CheckEmailScreen from "./src/screens/CheckEmailScreen";
import { useAuthListener } from "./src/hooks/useAuthListener";
import { useUserStore } from "./src/stores/useUserStore";
import { View } from "react-native";
import ProfileScreen from "./src/screens/ProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useAuthListener();

  const user = useUserStore((s) => s.user);

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="light">
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="home" component={HomeScreen} />
              <Stack.Screen name="explore" component={ExploreScreen} />
              <Stack.Screen name="services" component={ProfessionalExpertisesScreen} />
              <Stack.Screen name="expertise" component={ExpertiseScreen} />
              <Stack.Screen name="checkEmail" component={CheckEmailScreen} />
              {!!user ? (
                <Stack.Screen name="profile" component={ProfileScreen} />
              ) : (
                <Stack.Screen name="profile" component={AuthenticationScreen} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}

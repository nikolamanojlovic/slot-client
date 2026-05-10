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
import TenantScreen from "./src/screens/TenantScreen";
import ProfessionalExpertisesScreen from "./src/screens/ProfessionalExpertisesScreen";
import ProfessionalCreateExpertiseScreen from "./src/screens/ProfessionalCreateExpertiseScreen";
import ProfessionalEditExpertiseScreen from "./src/screens/ProfessionalEditExpertiseScreen";
import AuthenticationScreen from "./src/screens/AuthenticationScreen";
import CheckEmailScreen from "./src/screens/CheckEmailScreen";
import { useAuthListener } from "./src/hooks/useAuthListener";
import { useUserStore } from "./src/stores/useUserStore";
import ProfileScreen from "./src/screens/ProfileScreen";
import ProfessionalProfileScreen from "./src/screens/ProfessionalProfileScreen";
import ProfessionalScheduleScreen from "./src/screens/ProfessionalScheduleScreen";
import ProfessionalScheduleWeekScreen from "./src/screens/ProfessionalScheduleWeekScreen";
import ProfessionalAnalyticsScreen from "./src/screens/ProfessionalAnalyticsScreen";
import SchedulingStack from "./src/navigation/SchedulingStack";
import { UserRole } from "./src/types/api/user/user.enum";

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
              <Stack.Screen
                name="professional-expertises"
                component={ProfessionalExpertisesScreen}
              />
              <Stack.Screen name="tenant" component={TenantScreen} />
              <Stack.Screen name="professional-expertises-create" component={ProfessionalCreateExpertiseScreen} />
              <Stack.Screen name="professional-expertises-edit" component={ProfessionalEditExpertiseScreen} />
              <Stack.Screen name="checkEmail" component={CheckEmailScreen} />
              <Stack.Screen name="professional-schedule" component={ProfessionalScheduleScreen} />
              <Stack.Screen name="professional-schedule-week" component={ProfessionalScheduleWeekScreen} />
              <Stack.Screen name="professional-analytics" component={ProfessionalAnalyticsScreen} />
              <Stack.Screen name="scheduling" component={SchedulingStack} />
              {!user ? (
                <Stack.Screen name="profile" component={AuthenticationScreen} />
              ) : user.role === UserRole.PROFESSIONAL ? (
                <Stack.Screen name="profile" component={ProfessionalProfileScreen} />
              ) : (
                <Stack.Screen name="profile" component={ProfileScreen} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}

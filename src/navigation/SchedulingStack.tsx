import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/navigation/navigation.type";
import { SchedulingProvider } from "@/src/context/SchedulingContext";
import { TenantType } from "@/src/types/api/tenant/tenant.interface";
import SchedulingSelectProfessionalScreen from "@/src/screens/SchedulingSelectProfessionalScreen";
import SchedulingSelectDateScreen from "@/src/screens/SchedulingSelectDateScreen";
import SchedulingConfirmationScreen from "@/src/screens/SchedulingConfirmationScreen";
export type SchedulingStackParamList = {
  "select-professional": undefined;
  "select-date": undefined;
  "confirmation": undefined;
};

const Stack = createNativeStackNavigator<SchedulingStackParamList>();

type Props = NativeStackScreenProps<RootStackParamList, "scheduling">;

const SchedulingStack = ({ route }: Props) => {
  const { tenantId, tenantName, tenantType, expertise } = route.params;
  const isIndividual = tenantType === TenantType.INDIVIDUAL;

  return (
    <SchedulingProvider tenantId={tenantId} tenantName={tenantName} tenantType={tenantType} expertise={expertise}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isIndividual ? "select-date" : "select-professional"}
      >
        <Stack.Screen name="select-professional" component={SchedulingSelectProfessionalScreen} />
        <Stack.Screen name="select-date" component={SchedulingSelectDateScreen} />
        <Stack.Screen name="confirmation" component={SchedulingConfirmationScreen} />
      </Stack.Navigator>
    </SchedulingProvider>
  );
};

export default SchedulingStack;

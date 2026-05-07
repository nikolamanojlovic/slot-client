import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/navigation/navigation.type";
import { SchedulingProvider } from "@/src/context/SchedulingContext";
import { TenantType } from "@/src/types/api/tenant/tenant.interface";
import SchedulingSelectProfessionalScreen from "@/src/screens/SchedulingSelectProfessionalScreen";
import SchedulingSelectDateScreen from "@/src/screens/SchedulingSelectDateScreen";
import SchedulingSelectSlotScreen from "@/src/screens/SchedulingSelectSlotScreen";

export type SchedulingStackParamList = {
  "select-professional": undefined;
  "select-date": undefined;
  "select-slot": undefined;
};

const Stack = createNativeStackNavigator<SchedulingStackParamList>();

type Props = NativeStackScreenProps<RootStackParamList, "scheduling">;

const SchedulingStack = ({ route }: Props) => {
  const { tenantId, tenantType, expertise } = route.params;
  const isIndividual = tenantType === TenantType.INDIVIDUAL;

  return (
    <SchedulingProvider tenantId={tenantId} tenantType={tenantType} expertise={expertise}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isIndividual ? "select-date" : "select-professional"}
      >
        <Stack.Screen name="select-professional" component={SchedulingSelectProfessionalScreen} />
        <Stack.Screen name="select-date" component={SchedulingSelectDateScreen} />
        <Stack.Screen name="select-slot" component={SchedulingSelectSlotScreen} />
      </Stack.Navigator>
    </SchedulingProvider>
  );
};

export default SchedulingStack;

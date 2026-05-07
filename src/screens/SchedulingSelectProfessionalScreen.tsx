import BasicStepLayout from "@/src/components/BasicStepLayout";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import { useScheduling } from "@/src/context/SchedulingContext";
import { useQuery } from "@tanstack/react-query";
import { getProfessionals, ProfessionalUser } from "@/src/api/user";
import { ScrollView } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";
import ProfessionalSelectItem from "@/src/components/molecules/ProfessionalSelectItem";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SchedulingStackParamList } from "@/src/navigation/SchedulingStack";

const SchedulingSelectProfessionalScreen = () => {
  const { tenantId, expertise, setProfessionalId } = useScheduling();
  const rootNavigation = useAppNavigation();
  const navigation = useNavigation<NativeStackNavigationProp<SchedulingStackParamList>>();

  const { data: professionals, isLoading } = useQuery({
    queryKey: ["professionals", expertise.professionals],
    queryFn: () => getProfessionals(expertise.professionals),
    enabled: expertise.professionals.length > 0,
  });

  const handleSelect = (professional: ProfessionalUser) => {
    setProfessionalId(professional.externalId);
    navigation.navigate("select-date");
  };

  return (
    <BasicStepLayout
      title="Select Professional"
      showBack={false}
      onCancel={() => rootNavigation.navigate("tenant", { tenantId })}
    >
      {isLoading ? (
        <Spinner className="flex-1" size="large" color="black" />
      ) : (
        <ScrollView className="pt-2">
          <VStack space="sm">
            {professionals?.map((professional) => (
              <ProfessionalSelectItem
                key={professional.id}
                professional={professional}
                onPress={() => handleSelect(professional)}
              />
            ))}
          </VStack>
        </ScrollView>
      )}
    </BasicStepLayout>
  );
};

export default SchedulingSelectProfessionalScreen;

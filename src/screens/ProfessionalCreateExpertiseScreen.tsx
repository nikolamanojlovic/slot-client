import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/navigation/navigation.type";
import { ScrollView } from "react-native";
import ProfessionalCreateExpertiseForm from "@/src/components/organisms/forms/expretise/ProfessionalCreateExpertiseForm";
import { useErrorToast } from "@/src/hooks/useErrorToast";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import BasicNavigationLayout from "../components/BasicNavigationLayout";

type Props = NativeStackScreenProps<RootStackParamList, "professional-expertises-create">;

const ProfessionalCreateExpertiseScreen = ({ route }: Props) => {
  const { tenantId, professionalId } = route.params;
  const navigation = useAppNavigation();
  const { showError } = useErrorToast();

  return (
    <BasicNavigationLayout title="Create Expertise">
      <ScrollView className="flex-1 pt-4">
        <ProfessionalCreateExpertiseForm
          tenantId={tenantId}
          professionalId={professionalId}
          onClose={() => navigation.goBack()}
          onError={showError}
        />
      </ScrollView>
    </BasicNavigationLayout>
  );
};

export default ProfessionalCreateExpertiseScreen;

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/navigation/navigation.type";
import { ScrollView } from "react-native";
import ProfessionalEditExpertiseForm from "@/src/components/organisms/forms/expretise/ProfessionalEditExpertiseForm";
import { useErrorToast } from "@/src/hooks/useErrorToast";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import BasicNavigationLayout from "../components/BasicNavigationLayout";

type Props = NativeStackScreenProps<RootStackParamList, "professional-expertises-edit">;

const ProfessionalEditExpertiseScreen = ({ route }: Props) => {
  const { expertise } = route.params;
  const navigation = useAppNavigation();
  const { showError } = useErrorToast();

  return (
    <BasicNavigationLayout title="Edit Expertise">
      <ScrollView className="flex-1 pt-4">
        <ProfessionalEditExpertiseForm
          expertise={expertise}
          onClose={() => navigation.goBack()}
          onError={showError}
        />
      </ScrollView>
    </BasicNavigationLayout>
  );
};

export default ProfessionalEditExpertiseScreen;

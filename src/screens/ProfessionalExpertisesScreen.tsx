import BasicNavigationLayout from "../components/BasicNavigationLayout";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Plus } from "lucide-react-native";
import { ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ExpertiseResponse } from "@/src/types/api/expertise/expertise.interface";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/src/types/common/error.interface";
import { getMyExpertises } from "@/src/api/expertise";
import { useCategoryTree } from "@/src/hooks/useCategoryTree";
import { useUserStore } from "@/src/stores/useUserStore";
import { Expertise } from "@/src/types/api/expertise/expertise.interface";
import ProfessionalExpertiseItem from "@/src/components/molecules/ProfessionalExpertiseItem";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";

const ProfessionalExpertisesScreen = () => {
  const user = useUserStore((s) => s.user);
  const navigation = useAppNavigation();
  const { categoryMap } = useCategoryTree();

  const { isLoading, data: expertiseData } = useQuery<
    ExpertiseResponse,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["expertises/me"],
    queryFn: getMyExpertises,
  });

  const handleCreate = () => {
    if (user?.tenant?.id && user?.externalId) {
      navigation.navigate("professional-expertises-create", {
        tenantId: user.tenant.id,
        professionalId: user.externalId,
      });
    }
  };

  const handleEdit = (expertise: Expertise) => {
    navigation.navigate("professional-expertises-edit", { expertise });
  };

  return (
    <BasicNavigationLayout title="Expertises" showBack={false}>
      <VStack className="h-full mb-3">
        {isLoading && (
          <Spinner className="flex-1 m-0" size="large" color="black" />
        )}
        <Fab size="md" placement="bottom right" onPress={handleCreate}>
          <FabIcon as={Plus} />
        </Fab>
        <ScrollView className="pt-2 pb-3">
          <VStack space="sm">
            {expertiseData?.content.map((expertise) => (
              <ProfessionalExpertiseItem
                key={expertise.id}
                expertise={expertise}
                categoryMap={categoryMap}
                onPress={() => handleEdit(expertise)}
              />
            ))}
          </VStack>
        </ScrollView>
      </VStack>
    </BasicNavigationLayout>
  );
};

export default ProfessionalExpertisesScreen;

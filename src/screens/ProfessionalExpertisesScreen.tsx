import BasicLayout from "../components/BasicLayout";
import { Heading } from "@/components/ui/heading";
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
import { useState } from "react";
import { useCategoryTree } from "@/src/hooks/useCategoryTree";
import { useUserStore } from "@/src/stores/useUserStore";
import { Expertise } from "@/src/types/api/expertise/expertise.interface";
import ProfessionalExpertiseItem from "@/src/components/molecules/ProfessionalExpertiseItem";
import ProfessionalCreateExpertiseFormDrawer from "@/src/components/organisms/drawers/ProfessionalCreateExpertiseFormDrawer";
import ProfessionalEditExpertiseFormDrawer from "@/src/components/organisms/drawers/ProfessionalEditExpertiseFormDrawer";
import { useErrorToast } from "@/src/hooks/useErrorToast";

const ProfessionalExpertisesScreen = () => {
  const user = useUserStore((s) => s.user);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editExpertise, setEditExpertise] = useState<Expertise | null>(null);

  const { categoryMap } = useCategoryTree();
  const { showError } = useErrorToast();

  const { isLoading, data: expertiseData } = useQuery<
    ExpertiseResponse,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["expertises/me"],
    queryFn: getMyExpertises,
  });

  return (
    <BasicLayout>
      <VStack className="h-full mb-3">
        <Heading size="2xl" className="text-left text-primary-500 mt-3 mb-3">
          Expertises
        </Heading>
        {isLoading && (
          <Spinner className="flex-1 m-0" size="large" color="black" />
        )}
        <Fab
          size="md"
          placement="bottom right"
          onPress={() => setShowDrawer(true)}
        >
          <FabIcon as={Plus} />
        </Fab>
        <ScrollView className="pt-2 pb-3">
          <VStack space="sm">
            {expertiseData?.content.map((expertise) => (
              <ProfessionalExpertiseItem
                key={expertise.id}
                expertise={expertise}
                categoryMap={categoryMap}
                onPress={() => setEditExpertise(expertise)}
              />
            ))}
          </VStack>
        </ScrollView>
      </VStack>

      {user?.tenant?.id && user?.externalId && (
        <ProfessionalCreateExpertiseFormDrawer
          isOpen={showDrawer}
          onClose={() => setShowDrawer(false)}
          onError={showError}
          tenantId={user.tenant.id}
          professionalId={user.externalId}
        />
      )}

      {editExpertise && (
        <ProfessionalEditExpertiseFormDrawer
          isOpen={!!editExpertise}
          onClose={() => setEditExpertise(null)}
          onError={showError}
          expertise={editExpertise}
        />
      )}
    </BasicLayout>
  );
};

export default ProfessionalExpertisesScreen;

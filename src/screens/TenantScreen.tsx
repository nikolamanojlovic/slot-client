import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/navigation/navigation.type";
import BannerLayout from "../components/BannerLayout";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import TenantExpertiseItem from "@/src/components/molecules/TenantExpertiseItem";
import { useQuery } from "@tanstack/react-query";

import { ExpertiseResponse } from "@/src/types/api/expertise/expertise.interface";
import { TenantResponse } from "@/src/types/api/tenant/tenant.interface";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/src/types/common/error.interface";
import { getExpertise } from "@/src/api/expertise";
import { getTenant } from "@/src/api/tenant";

type Props = NativeStackScreenProps<RootStackParamList, "tenant">;

const TenantScreen = ({ route }: Props) => {
  const { tenantId } = route.params;

  const { isLoading: isLoadingExpertise, data: expertiseData } = useQuery<
    ExpertiseResponse,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["expertise", tenantId],
    queryFn: () => getExpertise(tenantId),
  });

  const { isLoading: isLoadingTenant, data: tenantData } = useQuery<
    TenantResponse,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["tenant", tenantId],
    queryFn: () => getTenant(tenantId),
  });

  const isLoading = isLoadingExpertise || isLoadingTenant;

  const dummyImage = "https://img.freepik.com/free-photo/strong-man-training-gym_1303-23478.jpg?semt=ais_hybrid&w=740&q=80";

  return (
    <BannerLayout bannerUri={dummyImage} bannerAlt={tenantData?.name}>
      <Heading size="2xl" className="text-left text-primary-500 mt-3 mb-3">
        {tenantData?.name ?? tenantId}
      </Heading>
      {isLoading && <Spinner size="large" color="black" />}
      <VStack space="sm">
        {expertiseData?.content.map((expertise) => (
          <TenantExpertiseItem
            key={expertise.id}
            expertise={expertise}
          />
        ))}
      </VStack>
    </BannerLayout>
  );
};

export default TenantScreen;

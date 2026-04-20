import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/navigation/navigation.type";
import BasicNavigationLayout from "../components/BasicNavigationLayout";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import Rating from "@/src/components/atoms/Rating";
import TenantExpertiseItem from "@/src/components/molecules/TenantExpertiseItem";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, Image } from "react-native";

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
    <BasicNavigationLayout title={tenantData?.name ?? ""}>
      <ScrollView className="flex-1">
        <Image
          source={{ uri: dummyImage }}
          style={{ width: "100%", height: 180, borderRadius: 8, marginBottom: 12 }}
          resizeMode="cover"
        />
        <HStack className="items-center mb-3" space="md">
          <Avatar size="md">
            <AvatarFallbackText>{tenantData?.name ?? tenantId}</AvatarFallbackText>
          </Avatar>
          <VStack>
            <Heading size="2xl" className="text-left text-primary-500">
              {tenantData?.name ?? tenantId}
            </Heading>
            <Rating />
          </VStack>
        </HStack>
        {isLoading && <Spinner size="large" color="black" />}
        <VStack space="sm">
          {expertiseData?.content.map((expertise) => (
            <TenantExpertiseItem
              key={expertise.id}
              expertise={expertise}
            />
          ))}
        </VStack>
      </ScrollView>
    </BasicNavigationLayout>
  );
};

export default TenantScreen;

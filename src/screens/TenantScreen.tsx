import { useMemo } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/navigation/navigation.type";
import BannerLayout from "../components/BannerLayout";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import Rating from "@/src/components/atoms/Rating";
import TenantExpertiseItem from "@/src/components/molecules/TenantExpertiseItem";
import { useQuery } from "@tanstack/react-query";
import {
  ExpertiseResponse,
  Expertise,
} from "@/src/types/api/expertise/expertise.interface";
import { TenantResponse } from "@/src/types/api/tenant/tenant.interface";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/src/types/common/error.interface";
import { getExpertise } from "@/src/api/expertise";
import { getTenant } from "@/src/api/tenant";
import { useCategoryTree } from "@/src/hooks/useCategoryTree";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import { colors } from "@/src/constants/colors";

type Props = NativeStackScreenProps<RootStackParamList, "tenant">;

const groupBySubcategory = (
  expertises: Expertise[],
  categoryMap: Map<string, string>,
): {
  subcategoryId: string;
  subcategoryName: string;
  expertises: Expertise[];
}[] => {
  const groups = new Map<
    string,
    { subcategoryId: string; subcategoryName: string; expertises: Expertise[] }
  >();

  expertises.forEach((expertise) => {
    const subcategoryId = expertise.categories[0];
    if (!subcategoryId) return;

    if (!groups.has(subcategoryId)) {
      groups.set(subcategoryId, {
        subcategoryId,
        subcategoryName: categoryMap.get(subcategoryId) ?? subcategoryId,
        expertises: [],
      });
    }
    groups.get(subcategoryId)!.expertises.push(expertise);
  });

  return Array.from(groups.values());
};

const TenantScreen = ({ route }: Props) => {
  const { tenantId } = route.params;
  const { categoryMap } = useCategoryTree();
  const navigation = useAppNavigation();

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

  const grouped = useMemo(
    () => groupBySubcategory(expertiseData?.content ?? [], categoryMap),
    [expertiseData, categoryMap],
  );

  const dummyImage =
    "https://img.freepik.com/free-photo/strong-man-training-gym_1303-23478.jpg?semt=ais_hybrid&w=740&q=80";

  return (
    <BannerLayout bannerUri={dummyImage} bannerAlt={tenantData?.name}>
      <HStack className="items-center mt-3 mb-3" space="md">
        <Avatar size="md">
          <AvatarFallbackText>
            {tenantData?.name ?? tenantId}
          </AvatarFallbackText>
        </Avatar>
        <VStack>
          <Heading size="2xl" className="text-left text-primary-500">
            {tenantData?.name ?? tenantId}
          </Heading>
          <Rating />
        </VStack>
      </HStack>
      {isLoading && <Spinner size="large" color="black" />}
      <VStack space="md">
        {grouped.map(({ subcategoryId, subcategoryName, expertises }) => (
          <VStack key={subcategoryId} space="sm">
            <Text
              className="font-bold text-center mb-1 mt-2"
              style={{ color: colors.primary }}
            >
              {subcategoryName}
            </Text>
            {expertises.map((expertise) => (
              <TenantExpertiseItem
                key={expertise.id}
                expertise={expertise}
                onPress={() => navigation.navigate("scheduling", { expertise, tenantId, tenantType: tenantData!.type })}
              />
            ))}
          </VStack>
        ))}
      </VStack>
    </BannerLayout>
  );
};

export default TenantScreen;

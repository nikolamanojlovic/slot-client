import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/navigation/navigation.type";
import BasicLayout from "../components/BasicLayout";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Badge, BadgeText } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { ExpertiseResponse } from "@/src/types/api/expertise/expertise.interface";
import { TenantResponse } from "@/src/types/api/tenant/tenant.interface";
import { Category } from "@/src/types/api/category/category.interface";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/src/types/common/error.interface";
import { getExpertise } from "@/src/api/expertise";
import { getTenant } from "@/src/api/tenant";
import { getCategoryLeafs } from "@/src/api/category";
import { useMemo } from "react";

type Props = NativeStackScreenProps<RootStackParamList, "expertise">;

const ExpertiseScreen = ({ route }: Props) => {
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

  const uniqueCategoryIds = useMemo(() => {
    if (!expertiseData) return [];
    return [...new Set(expertiseData.content.flatMap((e) => e.categories))];
  }, [expertiseData]);

  const { isLoading: isLoadingCategories, data: categoriesData } = useQuery<
    Category[],
    AxiosError<ErrorResponse>
  >({
    queryKey: ["categoryLeafs", uniqueCategoryIds],
    queryFn: () => getCategoryLeafs(uniqueCategoryIds),
    enabled: uniqueCategoryIds.length > 0,
  });

  const categoryMap = useMemo(() => {
    if (!categoriesData) return new Map<string, string>();
    return new Map(categoriesData.map((c) => [c.id, c.name]));
  }, [categoriesData]);

  const isLoading =
    isLoadingExpertise || isLoadingTenant || isLoadingCategories;

  return (
    <BasicLayout>
      <Heading size="2xl" className="text-left text-primary-500 mt-3 mb-3">
        {tenantData?.name ?? tenantId}
      </Heading>
      {isLoading && <Spinner size="large" color="black" />}
      <VStack space="sm">
        {expertiseData?.content.map((expertise) => (
          <HStack
            key={expertise.id}
            space="md"
            className="items-center justify-between p-3 border border-gray-200 rounded-lg"
          >
            <VStack space="xs" className="flex-1">
              <HStack space="xs" className="flex-wrap">
                {expertise.categories.map((catId) => (
                  <Badge key={catId} size="sm" variant="outline" action="muted">
                    <BadgeText>{categoryMap.get(catId) ?? catId}</BadgeText>
                  </Badge>
                ))}
              </HStack>
              <Text className="font-medium">{expertise.name}</Text>
              <Text size="sm" className="text-gray-500">
                {expertise.capacity}{" "}
                {expertise.capacity === 1 ? "person" : "people"}
              </Text>
            </VStack>
            <Text className="text-gray-500">{expertise.duration} min</Text>
          </HStack>
        ))}
      </VStack>
    </BasicLayout>
  );
};

export default ExpertiseScreen;

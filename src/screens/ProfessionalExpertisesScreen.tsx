import BasicLayout from "../components/BasicLayout";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Plus } from "lucide-react";
import { ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ExpertiseResponse } from "@/src/types/api/expertise/expertise.interface";
import { Category } from "@/src/types/api/category/category.interface";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/src/types/common/error.interface";
import { getMyExpertises } from "@/src/api/expertise";
import { getCategoryLeafs } from "@/src/api/category";
import { useMemo } from "react";

const ProfessionalExpertisesScreen = () => {
  const { isLoading: isLoadingExpertise, data: expertiseData } = useQuery<
    ExpertiseResponse,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["expertises/me"],
    queryFn: getMyExpertises,
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

  const isLoading = isLoadingExpertise || isLoadingCategories;

  return (
    <BasicLayout>
      <VStack className="h-full mb-3">
        <Heading size="2xl" className="text-left underline mt-3 mb-3">
          My Expertises
        </Heading>
        {isLoading && (
          <Spinner className="flex-1 m-0" size="large" color="black" />
        )}
        <Fab
          size="md"
          placement="bottom right"
          className="mb-2 bg-black text-white"
        >
          <FabIcon as={Plus} />
        </Fab>
        <ScrollView className="pt-2 pb-3">
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
                      <Badge
                        key={catId}
                        size="sm"
                        variant="outline"
                        action="muted"
                      >
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
        </ScrollView>
      </VStack>
    </BasicLayout>
  );
};

export default ProfessionalExpertisesScreen;

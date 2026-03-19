import BasicLayout from "../components/BasicLayout";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Fab, FabIcon } from "@/components/ui/fab";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
} from "@/components/ui/drawer";
import { Icon } from "@/components/ui/icon";
import { Plus, X } from "lucide-react-native";
import { ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ExpertiseResponse } from "@/src/types/api/expertise/expertise.interface";
import { CategoryTreeResponse } from "@/src/types/api/category/category.interface";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/src/types/common/error.interface";
import { getMyExpertises } from "@/src/api/expertise";
import { getCategoryTree } from "@/src/api/category";
import { useMemo, useState } from "react";
import { useUserStore } from "@/src/stores/useUserStore";
import ProfessionalCreateExpertiseForm from "@/src/components/organisms/forms/expretise/ProfessionalCreateExpertiseForm";

const ProfessionalExpertisesScreen = () => {
  const user = useUserStore((s) => s.user);
  const [showDrawer, setShowDrawer] = useState(false);

  const { isLoading, data: expertiseData } = useQuery<
    ExpertiseResponse,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["expertises/me"],
    queryFn: getMyExpertises,
  });

  const { data: categoryTreeData } = useQuery<
    CategoryTreeResponse,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["categories/tree"],
    queryFn: getCategoryTree,
  });

  const categoryMap = useMemo(() => {
    if (!categoryTreeData) return new Map<string, string>();
    return new Map(
      categoryTreeData.categories
        .flatMap((sc) => sc.subcategories)
        .map((c) => [c.id, c.name]),
    );
  }, [categoryTreeData]);

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
          onPress={() => setShowDrawer(true)}
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

      <Drawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        anchor="bottom"
        size="full"
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <Heading size="lg">Your new expertise</Heading>
            <DrawerCloseButton>
              <Icon as={X} size="md" />
            </DrawerCloseButton>
          </DrawerHeader>
          <DrawerBody>
            {user?.tenant?.id && user?.externalId && (
              <ProfessionalCreateExpertiseForm
                superCategories={categoryTreeData?.categories ?? []}
                tenantId={user.tenant.id}
                professionalId={user.externalId}
                onClose={() => setShowDrawer(false)}
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </BasicLayout>
  );
};

export default ProfessionalExpertisesScreen;

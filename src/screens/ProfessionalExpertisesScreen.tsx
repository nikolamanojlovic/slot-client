import BasicLayout from "../components/BasicLayout";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
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
import ProfessionalExpertiseItem from "@/src/components/molecules/ProfessionalExpertiseItem";

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
              />
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
            <Heading size="lg" className="text-primary-500">
              Add expertise
            </Heading>
            <DrawerCloseButton>
              <Icon as={X} size="md" color="#06392F" />
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

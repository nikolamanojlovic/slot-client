import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { getCategoryTree } from "@/src/types/api/category/category.funtion";
import {
  CategoryTreeResponse,
  SuperCategory,
} from "@/src/types/api/category/category.interface";
import { CategoryView } from "@/src/types/api/category/category.types";
import { ErrorResponse } from "@/src/types/common/error.interface";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import CategoryScroll from "../../molecules/category/CategoryScroll";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import { ScrollView } from "react-native";

type CategoryExplorerProps = {
  view: CategoryView;
};

const CategoryExplorer = ({ view }: CategoryExplorerProps) => {
  const toast = useToast();
  const navigation = useAppNavigation();

  const { isLoading, data, error } = useQuery<
    CategoryTreeResponse,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["categoryTree"],
    queryFn: getCategoryTree,
    enabled: view === "categories",
  });

  useEffect(() => {
    if (error) {
      showCategoryExplorerErrorToast();
    }
  }, [error]);

  const showCategoryExplorerErrorToast = () => {
    const toastId = `toast-${Date.now()}`;
    toast.show({
      id: toastId,
      placement: "top",
      duration: 3000,
      render: () => {
        return (
          <Toast nativeID={toastId} action="error" variant="solid">
            <ToastDescription>
              {error?.response?.data?.message ?? `Something went wrong.`}
            </ToastDescription>
          </Toast>
        );
      },
      onCloseComplete: () => {
        navigation.navigate("home");
      },
    });
  };

  return (
    <ScrollView className="w-full flex-1">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {[...(data?.categories || []), ...(data?.categories || [])].map(
            (category: SuperCategory) => (
              <Box className="mb-3">
                <Pressable key={category.id}>
                  <Heading size="md" className="mb-2">
                    {category.name}
                  </Heading>
                </Pressable>
                <CategoryScroll
                  categories={[
                    ...category.subcategories,
                    ...category.subcategories,
                    ...category.subcategories,
                  ]}
                />
              </Box>
            )
          )}
        </>
      )}
    </ScrollView>
  );
};

export default CategoryExplorer;

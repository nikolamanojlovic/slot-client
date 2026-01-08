import { View } from "react-native";
import BasicLayout from "../BasicLayout";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import CategorySearch from "../../molecules/CategorySearch";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";
import { CategoryView } from "@/src/types/api/category/category.types";
import CategoryExplorer from "../../organisms/navigation/CategoryExplorer";
import BusinessExplorer from "../../organisms/navigation/BusinessExplorer";

const CategoryPage = () => {
  const toast = useToast();
  const [view, setView] = useState<CategoryView>("businesses");

  return (
    <BasicLayout>
      <View className="flex-1 pr-3 pl-3">
        <VStack className="mb-6">
          <Heading size="2xl" className="text-left underline mt-3 mb-3">
            Explore
          </Heading>
          <CategorySearch view={view} setView={setView} />
        </VStack>
        {view === "businesses" ? (
          <BusinessExplorer />
        ) : (
          <CategoryExplorer view={view} />
        )}
      </View>
    </BasicLayout>
  );
};

export default CategoryPage;

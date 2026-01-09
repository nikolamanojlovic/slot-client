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
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { House, ListTree } from "lucide-react";

const ExplorePage = () => {
  const toast = useToast();
  const [view, setView] = useState<CategoryView>("businesses");

  return (
    <BasicLayout>
      <View className="flex-1 pr-3 pl-3">
        <VStack className="mb-6">
          <HStack className="w-full justify-between">
            <Heading size="2xl" className="text-left underline mt-3 mb-3">
              Explore
            </Heading>
            <HStack>
              <Pressable
                className={`items-center justify-center m-auto mr-2 text-white w-10 h-10 rounded-full ${
                  view === "businesses" ? "bg-gray-500" : "bg-black"
                }`}
                onPress={() => setView("businesses")}
              >
                <Icon as={House} size="2xs" />
              </Pressable>
              <Pressable
                className={`items-center justify-center m-auto text-white w-10 h-10 rounded-full ${
                  view === "categories" ? "bg-gray-500" : "bg-black"
                }`}
                onPress={() => setView("categories")}
              >
                <Icon as={ListTree} size="2xs" />
              </Pressable>
            </HStack>
          </HStack>
          <CategorySearch />
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

export default ExplorePage;

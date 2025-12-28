import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { CategoryView } from "@/src/types/api/category/category.types";
import { House, TreePine } from "lucide-react";

type CategorySearchProps = {
  view: CategoryView;
  setView: (view: CategoryView) => void;
};

const CategorySearch = ({ view, setView }: CategorySearchProps) => {
  return (
    <HStack className="w-full">
      <Input className="flex-1" variant="underlined" size="md">
        <InputField placeholder="Explore categories" />
      </Input>
      <Pressable
        className={`items-center justify-center ml-5 ${
          view === "businesses" ? "text-black" : "text-black/50"
        }`}
        onPress={() => setView("businesses")}
      >
        <Icon as={House} size="xs" />
      </Pressable>
      <Pressable
        className={`items-center justify-center ml-5 ${
          view === "categories" ? "text-black" : "text-black/50"
        }`}
        onPress={() => setView("categories")}
      >
        <Icon as={TreePine} size="xs" />
      </Pressable>
    </HStack>
  );
};

export default CategorySearch;

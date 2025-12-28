import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Category } from "@/src/types/api/category/category.interface";
import { Dumbbell } from "lucide-react";
import { Pressable } from "react-native";

interface CategoryPressableProps {
  category: Category;
}

export const CategoryPressable = ({ category }: CategoryPressableProps) => {
  return (
    <Pressable
      key={category.id}
      className="bg-gray-700 min-h-[125px] w-[125px] mr-3 text-white flex flex-col items-center justify-between p-2"
    >
      <Box className="flex-1 flex items-center justify-center w-full">
        <Icon as={Dumbbell} size="xl" className="text-white" />
      </Box>
      <Text className="w-full text-white text-center mt-2 mb-2" size="sm">
        {category.name}
      </Text>
    </Pressable>
  );
};

export default CategoryPressable;

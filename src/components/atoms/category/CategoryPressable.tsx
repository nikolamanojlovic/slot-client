import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Category } from "@/src/types/api/category/category.interface";
import { Dumbbell } from "lucide-react";
import { Pressable } from "react-native";
import { colors } from "@/src/constants/colors";

interface CategoryPressableProps {
  category: Category;
}

export const CategoryPressable = ({ category }: CategoryPressableProps) => {
  return (
    <Pressable
      key={category.id}
      className="min-h-[125px] w-[125px] mr-3 flex flex-col items-center justify-between p-2"
      style={{ backgroundColor: colors.neutral }}
    >
      <Box className="flex-1 flex items-center justify-center w-full">
        <Icon as={Dumbbell} size="xl" color={colors.white} />
      </Box>
      <Text
        className="w-full text-center mt-2 mb-2"
        style={{ color: colors.white }}
        size="sm"
      >
        {category.name}
      </Text>
    </Pressable>
  );
};

export default CategoryPressable;

import { Category } from "@/src/types/api/category/category.interface";
import { ScrollView } from "react-native";
import CategoryPressable from "../../atoms/category/CategoryPressable";

interface CategoryScrollProps {
  categories: Category[];
}

const CategoryScroll = ({ categories }: CategoryScrollProps) => {
  return (
    <ScrollView
      contentContainerStyle={{ padding: 0 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {categories.map((category) => (
        <CategoryPressable key={category.id} category={category} />
      ))}
    </ScrollView>
  );
};

export default CategoryScroll;

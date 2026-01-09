import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";

const CategorySearch = () => {
  return (
    <HStack className="w-full">
      <Input className="flex-1" variant="underlined" size="md">
        <InputField placeholder="Search for categories and businesses" />
      </Input>
    </HStack>
  );
};

export default CategorySearch;

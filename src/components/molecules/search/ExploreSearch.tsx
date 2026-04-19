import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { SearchIcon } from "@/components/ui/icon";
import { colors } from "@/src/constants/colors";

interface ExploreSearchProps {
  query?: string;
  setQuery: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const ExploreSearch = ({ query, setQuery }: ExploreSearchProps) => {
  const handleChangeText = (text: string) => {
    const trimmed = text.trim();
    setQuery(trimmed || undefined);
  };

  return (
    <HStack className="w-full mb-2">
      <Input className="flex-1" size="md">
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} color={colors.primary} />
        </InputSlot>
        <InputField
          placeholder="Search for categories and businesses"
          value={query}
          onChangeText={handleChangeText}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </Input>
    </HStack>
  );
};

export default ExploreSearch;

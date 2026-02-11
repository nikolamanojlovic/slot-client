import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";

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
    <HStack className="w-full">
      <Input className="flex-1" variant="underlined" size="md">
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

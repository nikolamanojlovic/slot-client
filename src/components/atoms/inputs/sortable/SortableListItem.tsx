import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

interface Props {
  children: React.ReactNode;
}

const SortableListItem = ({ children }: Props) => {
  return (
    <HStack
      space="sm"
      className="items-center p-3 rounded-lg border border-outline-200 bg-white"
    >
      {/* drag handle placeholder */}
      <Text className="text-typography-400 text-lg w-5 text-center">⠿</Text>

      <HStack className="flex-1">
        {children}
      </HStack>
    </HStack>
  );
};

export default SortableListItem;

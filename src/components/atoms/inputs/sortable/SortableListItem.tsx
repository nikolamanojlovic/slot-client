import { Pressable } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import { ChevronUp, ChevronDown } from "lucide-react-native";
import { colors } from "@/src/constants/colors";

interface Props {
  children: React.ReactNode;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const SortableListItem = ({ children, canMoveUp, canMoveDown, onMoveUp, onMoveDown }: Props) => {
  return (
    <HStack
      space="sm"
      className="items-center p-3 rounded-lg border border-outline-200 bg-white"
    >
      <VStack style={{ width: 20 }}>
        <Pressable onPress={onMoveUp} disabled={!canMoveUp} hitSlop={4}>
          <Icon
            as={ChevronUp}
            size="xs"
            style={{ color: canMoveUp ? colors.primary : "#d1d5db" }}
          />
        </Pressable>
        <Pressable onPress={onMoveDown} disabled={!canMoveDown} hitSlop={4}>
          <Icon
            as={ChevronDown}
            size="xs"
            style={{ color: canMoveDown ? colors.primary : "#d1d5db" }}
          />
        </Pressable>
      </VStack>

      <HStack className="flex-1">
        {children}
      </HStack>
    </HStack>
  );
};

export default SortableListItem;

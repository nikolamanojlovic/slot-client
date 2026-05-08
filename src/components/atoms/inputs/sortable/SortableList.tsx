import { VStack } from "@/components/ui/vstack";
import SortableListItem from "./SortableListItem";

interface Props<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  onReorder: (items: T[]) => void;
}

const SortableList = <T,>({
  items,
  keyExtractor,
  renderItem,
  onReorder,
}: Props<T>) => {
  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onReorder(next);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onReorder(next);
  };

  return (
    <VStack space="sm">
      {items.map((item, index) => (
        <SortableListItem
          key={keyExtractor(item)}
          canMoveUp={index > 0}
          canMoveDown={index < items.length - 1}
          onMoveUp={() => moveUp(index)}
          onMoveDown={() => moveDown(index)}
        >
          {renderItem(item, index)}
        </SortableListItem>
      ))}
    </VStack>
  );
};

export default SortableList;

import { VStack } from "@/components/ui/vstack";
import SortableListItem from "./SortableListItem";

interface Props<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  onReorder: (items: T[]) => void;
}

const SortableList = <T,>({ items, keyExtractor, renderItem }: Props<T>) => {
  return (
    <VStack space="sm">
      {items.map((item, index) => (
        <SortableListItem key={keyExtractor(item)}>
          {renderItem(item, index)}
        </SortableListItem>
      ))}
    </VStack>
  );
};

export default SortableList;

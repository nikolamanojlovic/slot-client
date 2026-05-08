import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Text } from "@/components/ui/text";
import EditActionSheetItem from "@/src/components/atoms/actionsheet/EditActionSheetItem";
import RemoveActionSheetItem from "@/src/components/atoms/actionsheet/RemoveActionSheetItem";

interface Props {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

const EditRemoveActionSheet = ({
  isOpen,
  title,
  onClose,
  onEdit,
  onRemove,
}: Props) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        {title && (
          <Text className="font-bold text-center w-full px-3 py-2">{title}</Text>
        )}

        <EditActionSheetItem onPress={() => { onEdit(); onClose(); }} />
        <RemoveActionSheetItem onPress={() => { onRemove(); onClose(); }} />
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default EditRemoveActionSheet;

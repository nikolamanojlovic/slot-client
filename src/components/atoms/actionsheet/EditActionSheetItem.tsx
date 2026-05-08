import { ActionsheetItem, ActionsheetItemText, ActionsheetIcon } from "@/components/ui/actionsheet";
import { Pencil } from "lucide-react-native";

interface Props {
  onPress: () => void;
}

const EditActionSheetItem = ({ onPress }: Props) => {
  return (
    <ActionsheetItem onPress={onPress}>
      <ActionsheetIcon as={Pencil} />
      <ActionsheetItemText>Edit</ActionsheetItemText>
    </ActionsheetItem>
  );
};

export default EditActionSheetItem;

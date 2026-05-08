import { ActionsheetItem, ActionsheetItemText, ActionsheetIcon } from "@/components/ui/actionsheet";
import { Eraser } from "lucide-react-native";

interface Props {
  onPress: () => void;
}

const RemoveActionSheetItem = ({ onPress }: Props) => {
  return (
    <ActionsheetItem onPress={onPress}>
      <ActionsheetIcon as={Eraser} className="text-error-600" />
      <ActionsheetItemText className="text-error-600">Remove</ActionsheetItemText>
    </ActionsheetItem>
  );
};

export default RemoveActionSheetItem;

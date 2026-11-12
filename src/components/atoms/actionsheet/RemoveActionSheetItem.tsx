import { ActionsheetItem, ActionsheetItemText, ActionsheetIcon } from "@/components/ui/actionsheet";
import { Eraser } from "lucide-react-native";
import { colors } from "@/src/constants/colors";

interface Props {
  onPress: () => void;
}

const RemoveActionSheetItem = ({ onPress }: Props) => {
  return (
    <ActionsheetItem onPress={onPress}>
      <ActionsheetIcon as={Eraser} color={colors.error} />
      <ActionsheetItemText style={{ color: colors.error }}>
        Remove
      </ActionsheetItemText>
    </ActionsheetItem>
  );
};

export default RemoveActionSheetItem;

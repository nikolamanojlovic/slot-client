import { Pressable } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Trash2 } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import DateTimeField from "@/src/components/atoms/inputs/datetime/DateTimeField";

type ItemType = "shift" | "break";

interface Props {
  type: ItemType;
  from: Date;
  to: Date;
  onFromChange: (d: Date) => void;
  onToChange: (d: Date) => void;
  onRemove?: () => void;
}

const LABEL: Record<ItemType, string> = {
  shift: "Shift",
  break: "Break",
};

const ProfessionalScheduleWeekTimetableTemplateListItem = ({
  type,
  from,
  to,
  onFromChange,
  onToChange,
  onRemove,
}: Props) => {
  return (
    <HStack className="flex-1 items-center justify-between" space="sm">
      <Text
        className="font-semibold text-xs"
        style={{ width: 36, color: colors.primary }}
      >
        {LABEL[type]}
      </Text>
      <HStack className="justify-between items-center min-w-[50%]" space="sm">
        <DateTimeField
          mode="time"
          size="sm"
          value={from}
          onChange={onFromChange}
        />
        <Text className="text-xs text-typography-500">-</Text>
        <DateTimeField mode="time" size="sm" value={to} onChange={onToChange} />
      </HStack>
      <Pressable
        onPress={type === "break" ? onRemove : undefined}
        hitSlop={type === "break" ? 8 : 0}
        style={{ width: 16, alignItems: "center" }}
      >
        {type === "break" && (
          <Icon as={Trash2} size="xs" className="text-error-600" />
        )}
      </Pressable>
    </HStack>
  );
};

export default ProfessionalScheduleWeekTimetableTemplateListItem;

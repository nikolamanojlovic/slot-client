import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { colors } from "@/src/constants/colors";
import { WeekShortcut } from "@/src/components/molecules/ProfessionalScheduleWeekTimetableTemplate";

interface Props {
  isDisabled: boolean;
  onSelect: (shortcut: WeekShortcut) => void;
}

const ProfessionalScheduleWeekTimetableShortcuts = ({
  isDisabled,
  onSelect,
}: Props) => (
  <VStack space="xs" className="mb-4">
    <Text className="font-semibold text-xs" style={{ color: colors.primary }}>
      Shortcuts
    </Text>
    <Select
      isDisabled={isDisabled}
      onValueChange={(val) => onSelect(val as WeekShortcut)}
    >
      <SelectTrigger variant="outline" size="sm">
        <SelectInput placeholder="Apply a shortcut…" />
        <SelectIcon as={ChevronDownIcon} className="mr-2" />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          <SelectItem
            label="Copy Monday → Tuesday–Friday (weekend off)"
            value="mon-to-fri"
          />
          <SelectItem
            label="Copy Monday → Tuesday–Saturday (Sunday off)"
            value="mon-to-sat"
          />
          <SelectItem label="9:00–17:00 weekdays (weekend off)" value="9-17" />
        </SelectContent>
      </SelectPortal>
    </Select>
  </VStack>
);

export default ProfessionalScheduleWeekTimetableShortcuts;

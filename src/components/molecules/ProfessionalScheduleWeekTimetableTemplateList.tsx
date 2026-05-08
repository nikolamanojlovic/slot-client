import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { colors } from "@/src/constants/colors";
import ProfessionalScheduleWeekTimetableTemplateListItem from "./ProfessionalScheduleWeekTimetableTemplateListItem";

interface Props {
  shiftFrom: Date;
  shiftTo: Date;
  breakFrom: Date;
  breakTo: Date;
  hasBreak: boolean;
  onShiftFromChange: (d: Date) => void;
  onShiftToChange: (d: Date) => void;
  onBreakFromChange: (d: Date) => void;
  onBreakToChange: (d: Date) => void;
  onAddBreak: () => void;
  onRemoveBreak: () => void;
}

const ProfessionalScheduleWeekTimetableTemplateList = ({
  shiftFrom,
  shiftTo,
  breakFrom,
  breakTo,
  hasBreak,
  onShiftFromChange,
  onShiftToChange,
  onBreakFromChange,
  onBreakToChange,
  onAddBreak,
  onRemoveBreak,
}: Props) => {
  return (
    <VStack space="sm">
      <ProfessionalScheduleWeekTimetableTemplateListItem
        type="shift"
        from={shiftFrom}
        to={shiftTo}
        onFromChange={onShiftFromChange}
        onToChange={onShiftToChange}
      />

      {hasBreak && (
        <ProfessionalScheduleWeekTimetableTemplateListItem
          type="break"
          from={breakFrom}
          to={breakTo}
          onFromChange={onBreakFromChange}
          onToChange={onBreakToChange}
          onRemove={onRemoveBreak}
        />
      )}

      {!hasBreak && (
        <Button
          variant="link"
          size="xs"
          className="self-start"
          onPress={onAddBreak}
        >
          <ButtonText style={{ color: colors.primary }}>+ Add break</ButtonText>
        </Button>
      )}
    </VStack>
  );
};

export default ProfessionalScheduleWeekTimetableTemplateList;

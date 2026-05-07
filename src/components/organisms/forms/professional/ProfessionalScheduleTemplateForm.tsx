import { Input, InputField } from "@/components/ui/input";
import { HStack } from "@/components/ui/hstack";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { colors } from "@/src/constants/colors";
import DateTimeField from "@/src/components/atoms/inputs/datetime/DateTimeField";

interface Props {
  value: Date;
  onChange: (date: Date) => void;
  factor: number;
  onFactorChange: (factor: number) => void;
  isDisabled?: (date: Date) => boolean;
}

const ProfessionalScheduleTemplateForm = ({
  value,
  onChange,
  factor,
  onFactorChange,
  isDisabled,
}: Props) => {
  return (
    <HStack space="md">
      <FormControl className="flex-1">
        <FormControlLabel>
          <FormControlLabelText
            style={{ color: colors.primary }}
            className="font-semibold text-xs"
          >
            Anchor date
          </FormControlLabelText>
        </FormControlLabel>
        <DateTimeField mode="date" value={value} onChange={onChange} isDisabled={isDisabled} />
      </FormControl>

      <FormControl className="flex-1">
        <FormControlLabel>
          <FormControlLabelText
            style={{ color: colors.primary }}
            className="font-semibold text-xs"
          >
            Repetition factor
          </FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            keyboardType="numeric"
            value={String(factor)}
            onChangeText={(text) => {
              const parsed = parseInt(text, 10);
              if (!isNaN(parsed)) onFactorChange(parsed);
              else if (text === "") onFactorChange(0);
            }}
          />
        </Input>
      </FormControl>
    </HStack>
  );
};

export default ProfessionalScheduleTemplateForm;

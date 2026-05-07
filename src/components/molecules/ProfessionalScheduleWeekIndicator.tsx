import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Sunrise, Sun, Sunset } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { WeekResponse } from "@/src/api/scheduleTemplates";
import { getDominantPeriod, DayPeriod } from "@/src/utils/schedule";

interface Props {
  week: WeekResponse;
}

const periodIcon: Record<DayPeriod, typeof Sunrise> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
};

const ProfessionalScheduleWeekIndicator = ({ week }: Props) => {
  const period = getDominantPeriod(week.days);
  const IconComponent = period ? periodIcon[period] : null;

  return (
    <HStack className="flex-1 items-center justify-between">
      <Text className="font-semibold" style={{ color: colors.primary }}>
        Week {week.weekIndex + 1}
      </Text>
      {IconComponent && (
        <Icon as={IconComponent} size="sm" style={{ color: colors.primary }} />
      )}
    </HStack>
  );
};

export default ProfessionalScheduleWeekIndicator;

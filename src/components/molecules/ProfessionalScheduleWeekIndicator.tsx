import { useState } from "react";
import { Pressable } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Sunrise, Sun, Sunset, SunMoon } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { WeekResponse, deleteScheduleTemplateWeek } from "@/src/api/scheduleTemplates";
import { getDominantPeriod, DayPeriod } from "@/src/utils/schedule";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditRemoveActionSheet from "@/src/components/molecules/sheets/EditRemoveActionSheet";

interface Props {
  week: WeekResponse;
  templateId: string;
}

const periodIcon: Record<DayPeriod, typeof Sunrise> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
};

const ProfessionalScheduleWeekIndicator = ({ week, templateId }: Props) => {
  const navigation = useAppNavigation();
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { mutate: removeWeek } = useMutation({
    mutationFn: () => deleteScheduleTemplateWeek(templateId, week.weekIndex),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["schedule-template"] });
    },
  });

  const period = getDominantPeriod(week.days);
  const hasWorkingDays = week.days.some((d) => d.startTime);
  const IconComponent = period ? periodIcon[period] : hasWorkingDays ? SunMoon : null;

  return (
    <>
      <Pressable
        className="flex-1"
        onPress={() => navigation.navigate("professional-schedule-week", { week, templateId })}
        onLongPress={() => setIsMenuOpen(true)}
      >
        <HStack className="flex-1 items-center justify-between">
          <Text className="font-semibold" style={{ color: colors.primary }}>
            Week {week.weekIndex + 1}
          </Text>
          {IconComponent && (
            <Icon as={IconComponent} size="sm" style={{ color: colors.primary }} />
          )}
        </HStack>
      </Pressable>

      <EditRemoveActionSheet
        isOpen={isMenuOpen}
        title={`Week ${week.weekIndex + 1}`}
        onClose={() => setIsMenuOpen(false)}
        onEdit={() => navigation.navigate("professional-schedule-week", { week, templateId })}
        onRemove={() => removeWeek()}
      />
    </>
  );
};

export default ProfessionalScheduleWeekIndicator;

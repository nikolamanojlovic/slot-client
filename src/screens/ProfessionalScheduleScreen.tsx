import { useState, useEffect } from "react";
import BasicNavigationLayout from "../components/BasicNavigationLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createScheduleTemplate,
  getScheduleTemplate,
} from "@/src/api/scheduleTemplates";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { colors } from "@/src/constants/colors";
import { Spinner } from "@/components/ui/spinner";
import { View } from "react-native";
import { getMondayDateOfCurrentWeek, formatDateISO } from "@/src/utils/date";
import ProfessionalScheduleTemplateForm from "@/src/components/organisms/forms/professional/ProfessionalScheduleTemplateForm";
import SortableList from "@/src/components/atoms/inputs/sortable/SortableList";
import ProfessionalScheduleWeekIndicator from "@/src/components/molecules/ProfessionalScheduleWeekIndicator";
import { Text } from "@/components/ui/text";

const ProfessionalScheduleScreen = () => {
  const [anchorDate, setAnchorDate] = useState<Date>(
    getMondayDateOfCurrentWeek,
  );
  const [factor, setFactor] = useState(1);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["schedule-template"],
    queryFn: async () => {
      try {
        return await getScheduleTemplate();
      } catch (e: any) {
        if (e?.response?.status === 404) return null;
        throw e;
      }
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createScheduleTemplate({ anchorDate: formatDateISO(anchorDate) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-template"] });
    },
  });

  const hasTemplate = data !== null && data !== undefined;

  useEffect(() => {
    if (!data) return;
    const [year, month, day] = data.anchorDate.split("-").map(Number);
    setAnchorDate(new Date(year, month - 1, day));
    setFactor(data.repeatFactor);
  }, [data]);

  return (
    <BasicNavigationLayout title="Schedule" showBack={true}>
      <VStack className="mt-3 flex-1">
        {isLoading ? (
          <Spinner className="flex-1" size="large" color="black" />
        ) : (
          <View style={{ flex: 1 }}>
            <ProfessionalScheduleTemplateForm
              value={anchorDate}
              onChange={setAnchorDate}
              factor={factor}
              onFactorChange={setFactor}
              isDisabled={(date) => date.getDay() !== 1}
            />
            {data?.weeks && (
              <>
                <Text
                  style={{ color: colors.primary }}
                  className="font-semibold text-xs mt-4 mb-1"
                >
                  Weeks
                </Text>
                <SortableList
                  items={data.weeks}
                  keyExtractor={(week) => String(week.weekIndex)}
                  renderItem={(week) => (
                    <ProfessionalScheduleWeekIndicator week={week} />
                  )}
                  onReorder={() => {}}
                />
              </>
            )}
          </View>
        )}

        <Button
          className="mb-3"
          style={{ backgroundColor: colors.primary }}
          onPress={() => mutate()}
          isDisabled={isPending || isLoading}
        >
          <ButtonText>
            {isPending ? "Saving…" : hasTemplate ? "Save" : "Create"}
          </ButtonText>
        </Button>
      </VStack>
    </BasicNavigationLayout>
  );
};

export default ProfessionalScheduleScreen;

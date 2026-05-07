import { useEffect, useState } from "react";
import BasicNavigationLayout from "../components/BasicNavigationLayout";
import { Button, ButtonText } from "@/components/ui/button";
import { useUserStore } from "@/src/stores/useUserStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DayOfWeek,
  DaySchedule,
  WorkingHoursResponse,
  getMyWorkingHours,
  setWorkingHours,
} from "@/src/api/workingHours";
import { View } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { colors } from "@/src/constants/colors";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Info } from "lucide-react-native";
import ProfessionalScheduleTable, {
  DAYS,
  RowState,
  defaultRows,
} from "@/src/components/molecules/ProfessionalScheduleTable";

const toLocalTime = (date: Date | null) => {
  if (!date) return null;
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:00`;
};

const parseTime = (time: string | null): Date | null => {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

const responseToRows = (
  data: WorkingHoursResponse[],
): Record<DayOfWeek, RowState> => {
  const base = defaultRows();
  data.forEach(({ dayOfWeek, working, startTime, endTime }) => {
    base[dayOfWeek] = {
      working,
      startTime: parseTime(startTime),
      endTime: parseTime(endTime),
    };
  });
  return base;
};

const ProfessionalScheduleScreenOld = () => {
  const user = useUserStore((s) => s.user);
  const [rows, setRows] = useState<Record<DayOfWeek, RowState>>(defaultRows);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["working-hours/me", user?.tenant?.id],
    queryFn: async () => {
      try {
        return await getMyWorkingHours(user!.tenant!.id);
      } catch (e: any) {
        if (e?.response?.status === 404) return null;
        throw e;
      }
    },
    enabled: !!user?.tenant?.id,
  });

  useEffect(() => {
    if (data) setRows(responseToRows(data));
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: (schedule: DaySchedule[]) =>
      setWorkingHours(user!.tenant!.id, { schedule }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["working-hours/me", user?.tenant?.id] });
    },
  });

  const update = (day: DayOfWeek, patch: Partial<RowState>) =>
    setRows((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));

  const handleSave = () => {
    const schedule: DaySchedule[] = DAYS.map(({ key }) => {
      const { working, startTime, endTime } = rows[key];
      return {
        dayOfWeek: key,
        working,
        startTime: working ? toLocalTime(startTime) : null,
        endTime: working ? toLocalTime(endTime) : null,
      };
    });
    mutate(schedule);
  };

  return (
    <BasicNavigationLayout title="Schedule" showBack={true}>
      <VStack className="mt-3 flex-1">
        {isLoading ? (
          <Spinner className="flex-1" size="large" color="black" />
        ) : (
          <View style={{ flex: 1 }}>
            <ProfessionalScheduleTable rows={rows} onUpdate={update} />
          </View>
        )}
        {!isLoading && data === null && (
          <Alert action="error" className="mb-3">
            <AlertIcon as={Info} />
            <AlertText>
              Please add hours in order to enable scheduling
            </AlertText>
          </Alert>
        )}
        <Button
          onPress={handleSave}
          isDisabled={isPending || isLoading}
          className="mb-3"
          style={{ backgroundColor: colors.primary }}
        >
          <ButtonText>{isPending ? "Saving…" : "Save"}</ButtonText>
        </Button>
      </VStack>
    </BasicNavigationLayout>
  );
};

export default ProfessionalScheduleScreenOld;

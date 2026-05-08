import { useState, forwardRef, useImperativeHandle } from "react";
import { Switch, Pressable, View } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { colors } from "@/src/constants/colors";
import {
  DayResponse,
  BreakResponse,
  UpdateScheduleTemplateWeekRequest,
} from "@/src/api/scheduleTemplates";
import { DAYS_OF_WEEK, DAY_OF_WEEK_LABELS } from "@/src/utils/date";
import { formatTimeRange } from "@/src/utils/schedule";
import ProfessionalScheduleWeekTimetableTemplateList from "./ProfessionalScheduleWeekTimetableTemplateList";

type DayState = {
  enabled: boolean;
  startTime: string | null;
  endTime: string | null;
  breakStartTime: string | null;
  breakEndTime: string | null;
};

const toDate = (time: string | null | undefined): Date => {
  const d = new Date();
  if (!time) return d;
  const [h, m] = time.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d;
};

const formatTime = (date: Date): string =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const initDayStates = (days: DayResponse[], breaks: BreakResponse[]): Record<string, DayState> => {
  const breakMap = Object.fromEntries(breaks.map((b) => [b.dayOfWeek, b]));
  return Object.fromEntries(
    DAYS_OF_WEEK.map((dow) => {
      const d = days.find((x) => x.dayOfWeek === dow.toUpperCase());
      const b = breakMap[dow.toUpperCase()];
      return [
        dow.toUpperCase(),
        {
          enabled: !!d?.startTime,
          startTime: d?.startTime ?? null,
          endTime: d?.endTime ?? null,
          breakStartTime: b?.startTime ?? null,
          breakEndTime: b?.endTime ?? null,
        },
      ];
    })
  );
};

export type WeekShortcut = "mon-to-fri" | "mon-to-sat" | "9-17";

export interface TimetableHandle {
  getWeekData: () => UpdateScheduleTemplateWeekRequest;
  collapse: () => void;
  applyShortcut: (shortcut: WeekShortcut) => void;
}

interface Props {
  days: DayResponse[];
  breaks: BreakResponse[];
  isEditing: boolean;
}

const ProfessionalScheduleWeekTimetableTemplate = forwardRef<TimetableHandle, Props>(
  ({ days, breaks, isEditing }, ref) => {
    const [dayStates, setDayStates] = useState<Record<string, DayState>>(() =>
      initDayStates(days, breaks)
    );
    const [expandedDay, setExpandedDay] = useState<string | null>(null);
    const [hasBreak, setHasBreak] = useState(false);
    const [pendingFrom, setPendingFrom] = useState<Date>(new Date());
    const [pendingTo, setPendingTo] = useState<Date>(new Date());
    const [pendingBreakFrom, setPendingBreakFrom] = useState<Date>(new Date());
    const [pendingBreakTo, setPendingBreakTo] = useState<Date>(new Date());

    const commitPending = (upperDow: string) => {
      setDayStates((prev) => ({
        ...prev,
        [upperDow]: {
          ...prev[upperDow],
          startTime: formatTime(pendingFrom),
          endTime: formatTime(pendingTo),
          breakStartTime: hasBreak ? formatTime(pendingBreakFrom) : null,
          breakEndTime: hasBreak ? formatTime(pendingBreakTo) : null,
        },
      }));
    };

    const applyAndExpand = (dow: string) => {
      if (expandedDay) {
        commitPending(expandedDay.toUpperCase());
      }
      if (dow === expandedDay) {
        setExpandedDay(null);
      } else {
        const state = dayStates[dow.toUpperCase()];
        setPendingFrom(toDate(state.startTime ?? "09:00"));
        setPendingTo(toDate(state.endTime ?? "17:00"));
        setPendingBreakFrom(toDate(state.breakStartTime));
        setPendingBreakTo(toDate(state.breakEndTime));
        setHasBreak(!!state.breakStartTime);
        setExpandedDay(dow);
      }
    };

    const toggleDay = (dow: string) => {
      const upperDow = dow.toUpperCase();
      const current = dayStates[upperDow];

      if (current.enabled) {
        // disabling: clear times, collapse
        if (expandedDay) commitPending(expandedDay.toUpperCase());
        setDayStates((prev) => ({
          ...prev,
          [upperDow]: {
            ...prev[upperDow],
            enabled: false,
            startTime: null,
            endTime: null,
            breakStartTime: null,
            breakEndTime: null,
          },
        }));
        setExpandedDay(null);
      } else {
        // enabling: set defaults, expand
        if (expandedDay && expandedDay !== dow) {
          commitPending(expandedDay.toUpperCase());
        }
        const startTime = "09:00";
        const endTime = "17:00";
        setDayStates((prev) => ({
          ...prev,
          [upperDow]: { ...prev[upperDow], enabled: true, startTime, endTime },
        }));
        setPendingFrom(toDate(startTime));
        setPendingTo(toDate(endTime));
        setPendingBreakFrom(toDate(null));
        setPendingBreakTo(toDate(null));
        setHasBreak(false);
        setExpandedDay(dow);
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        collapse: () => {
          if (expandedDay) commitPending(expandedDay.toUpperCase());
          setExpandedDay(null);
        },
        applyShortcut: (shortcut) => {
          if (expandedDay) commitPending(expandedDay.toUpperCase());
          setExpandedDay(null);
          setDayStates((prev) => {
            const off: DayState = { enabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null };

            if (shortcut === "9-17") {
              const day: DayState = { enabled: true, startTime: "09:00", endTime: "17:00", breakStartTime: null, breakEndTime: null };
              return { MONDAY: day, TUESDAY: day, WEDNESDAY: day, THURSDAY: day, FRIDAY: day, SATURDAY: off, SUNDAY: off };
            }

            const mon = prev["MONDAY"];
            if (!mon.enabled) return prev;
            const copy: DayState = { enabled: true, startTime: mon.startTime, endTime: mon.endTime, breakStartTime: mon.breakStartTime, breakEndTime: mon.breakEndTime };

            if (shortcut === "mon-to-fri") {
              return { ...prev, TUESDAY: copy, WEDNESDAY: copy, THURSDAY: copy, FRIDAY: copy, SATURDAY: off, SUNDAY: off };
            }
            if (shortcut === "mon-to-sat") {
              return { ...prev, TUESDAY: copy, WEDNESDAY: copy, THURSDAY: copy, FRIDAY: copy, SATURDAY: copy, SUNDAY: off };
            }
            return prev;
          });
        },
        getWeekData: (): UpdateScheduleTemplateWeekRequest => {
          const states = { ...dayStates };
          if (expandedDay) {
            const upperDow = expandedDay.toUpperCase();
            states[upperDow] = {
              ...states[upperDow],
              startTime: formatTime(pendingFrom),
              endTime: formatTime(pendingTo),
              breakStartTime: hasBreak ? formatTime(pendingBreakFrom) : null,
              breakEndTime: hasBreak ? formatTime(pendingBreakTo) : null,
            };
          }

          const daysPayload = DAYS_OF_WEEK.map((dow) => {
            const s = states[dow.toUpperCase()];
            return {
              dayOfWeek: dow.toUpperCase(),
              startTime: s.enabled ? s.startTime : null,
              endTime: s.enabled ? s.endTime : null,
            };
          });

          const breaksPayload = DAYS_OF_WEEK.filter((dow) => {
            const s = states[dow.toUpperCase()];
            return s.enabled && s.breakStartTime && s.breakEndTime;
          }).map((dow) => {
            const s = states[dow.toUpperCase()];
            return {
              dayOfWeek: dow.toUpperCase(),
              startTime: s.breakStartTime!,
              endTime: s.breakEndTime!,
            };
          });

          return { days: daysPayload, breaks: breaksPayload };
        },
      }),
      [dayStates, expandedDay, hasBreak, pendingFrom, pendingTo, pendingBreakFrom, pendingBreakTo]
    );

    return (
      <VStack space="sm">
        {DAYS_OF_WEEK.map((dow) => {
          const upperDow = dow.toUpperCase();
          const state = dayStates[upperDow];
          const isExpanded = expandedDay === dow;

          return (
            <Pressable
              key={dow}
              onPress={() => isEditing && state.enabled && applyAndExpand(dow)}
              className="rounded-lg border border-outline-200 bg-white p-3"
              style={({ pressed }) => ({
                opacity: isEditing && state.enabled && pressed ? 0.7 : 1,
              })}
            >
              <HStack className="items-center" space="sm">
                <Text
                  className="font-semibold text-xs"
                  style={{ width: 36, color: colors.primary }}
                >
                  {DAY_OF_WEEK_LABELS[dow]}
                </Text>

                <VStack className="flex-1">
                  <Text className="text-xs text-typography-500">Work</Text>
                  <Text className="text-xs font-medium text-typography-800">
                    {state.enabled
                      ? isExpanded
                        ? formatTimeRange(formatTime(pendingFrom), formatTime(pendingTo))
                        : formatTimeRange(state.startTime, state.endTime)
                      : "—"}
                  </Text>
                </VStack>

                <VStack className="flex-1">
                  <Text className="text-xs text-typography-500">Break</Text>
                  <Text className="text-xs font-medium text-typography-800">
                    {state.enabled
                      ? isExpanded
                        ? hasBreak
                          ? formatTimeRange(formatTime(pendingBreakFrom), formatTime(pendingBreakTo))
                          : "—"
                        : formatTimeRange(state.breakStartTime, state.breakEndTime)
                      : "—"}
                  </Text>
                </VStack>

                <View onStartShouldSetResponder={() => true}>
                  <Switch
                    value={state.enabled}
                    disabled={!isEditing}
                    trackColor={{ true: colors.primary, false: "#d1d5db" }}
                    onValueChange={() => { if (isEditing) toggleDay(dow); }}
                  />
                </View>
              </HStack>

              {isExpanded && (
                <>
                  <Divider className="my-3" />
                  <ProfessionalScheduleWeekTimetableTemplateList
                    shiftFrom={pendingFrom}
                    shiftTo={pendingTo}
                    breakFrom={pendingBreakFrom}
                    breakTo={pendingBreakTo}
                    hasBreak={hasBreak}
                    onShiftFromChange={setPendingFrom}
                    onShiftToChange={setPendingTo}
                    onBreakFromChange={setPendingBreakFrom}
                    onBreakToChange={setPendingBreakTo}
                    onAddBreak={() => setHasBreak(true)}
                    onRemoveBreak={() => setHasBreak(false)}
                  />
                </>
              )}
            </Pressable>
          );
        })}
      </VStack>
    );
  }
);

export default ProfessionalScheduleWeekTimetableTemplate;

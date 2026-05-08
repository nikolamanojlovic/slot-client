import { DayResponse } from "@/src/api/scheduleTemplates";

export type DayPeriod = "morning" | "afternoon" | "evening";

export const formatTimeRange = (
  start: string | null | undefined,
  end: string | null | undefined,
): string => {
  if (!start || !end) return "—";
  return `${start.slice(0, 5)} - ${end.slice(0, 5)}`;
};

const parseHour = (time: string): number => {
  return parseInt(time.split(":")[0], 10);
};

const getPeriod = (hour: number): DayPeriod | null => {
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return null;
};

export const getDominantPeriod = (days: DayResponse[]): DayPeriod | null => {
  if (days.length === 0) return null;

  const counts: Record<DayPeriod, number> = {
    morning: 0,
    afternoon: 0,
    evening: 0,
  };

  let workingDays = 0;
  for (const day of days) {
    if (!day.startTime) continue;
    workingDays++;
    const period = getPeriod(parseHour(day.startTime));
    if (period) counts[period]++;
  }

  if (workingDays === 0) return null;

  const threshold = workingDays * 0.6;

  for (const period of Object.keys(counts) as DayPeriod[]) {
    if (counts[period] >= threshold) return period;
  }

  return null;
};

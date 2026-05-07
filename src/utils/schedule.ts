import { DayResponse } from "@/src/api/scheduleTemplates";

export type DayPeriod = "morning" | "afternoon" | "evening";

const parseHour = (time: string): number => {
  // supports HH:mm or HH:mm:ss
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

  for (const day of days) {
    if (!day.startTime) continue;
    const period = getPeriod(parseHour(day.startTime));
    if (period) counts[period]++;
  }

  const threshold = days.length * 0.6;

  for (const period of Object.keys(counts) as DayPeriod[]) {
    if (counts[period] >= threshold) return period;
  }

  return null;
};

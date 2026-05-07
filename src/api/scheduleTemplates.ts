import api from "../lib/axios";

export interface ScheduleTemplate {
  anchorDate: string; // ISO date: YYYY-MM-DD
  repeatFactor: number;
  weeks: WeekResponse[];
}

export interface WeekResponse {
  weekIndex: number;
  days: DayResponse[];
  breaks: BreakResponse[];
}

export interface DayResponse {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface BreakResponse {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface CreateScheduleTemplateRequest {
  anchorDate: string; // ISO date: YYYY-MM-DD
}

export const getScheduleTemplate = async (): Promise<ScheduleTemplate> => {
  const { data } = await api.get<ScheduleTemplate>("/schedules/templates");
  return data;
};

export const createScheduleTemplate = async (
  body: CreateScheduleTemplateRequest,
): Promise<ScheduleTemplate> => {
  const { data } = await api.post<ScheduleTemplate>(
    "/schedules/templates",
    body,
  );
  return data;
};

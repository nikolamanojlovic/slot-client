import api from "../lib/axios";

export interface ScheduleTemplate {
  id: string;
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

export interface UpdateScheduleTemplateRequest {
  anchorDate?: string;
  repeatFactor?: number;
  weekOrder?: number[];
}

export const updateScheduleTemplate = async (
  templateId: string,
  body: UpdateScheduleTemplateRequest,
): Promise<ScheduleTemplate> => {
  const { data } = await api.patch<ScheduleTemplate>(`/schedules/templates/${templateId}`, body);
  return data;
};

export const deleteScheduleTemplateWeek = async (templateId: string, weekIndex: number): Promise<void> => {
  await api.delete(`/schedules/templates/${templateId}/weeks/${weekIndex}`);
};

export const addScheduleTemplateWeek = async (templateId: string): Promise<ScheduleTemplate> => {
  const { data } = await api.post<ScheduleTemplate>(`/schedules/templates/${templateId}/weeks`);
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

export interface UpdateWeekDayRequest {
  dayOfWeek: string;
  startTime: string | null;
  endTime: string | null;
}

export interface UpdateWeekBreakRequest {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface UpdateScheduleTemplateWeekRequest {
  days: UpdateWeekDayRequest[];
  breaks: UpdateWeekBreakRequest[];
}

export const updateScheduleTemplateWeek = async (
  templateId: string,
  weekIndex: number,
  body: UpdateScheduleTemplateWeekRequest,
): Promise<void> => {
  await api.put(`/schedules/templates/${templateId}/weeks/${weekIndex}`, body);
};

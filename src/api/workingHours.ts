import api from "../lib/axios";

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface DaySchedule {
  dayOfWeek: DayOfWeek;
  working: boolean;
  startTime: string | null;
  endTime: string | null;
}

export interface SetWorkingHoursRequest {
  schedule: DaySchedule[];
}

export interface WorkingHoursResponse {
  dayOfWeek: DayOfWeek;
  working: boolean;
  startTime: string | null;
  endTime: string | null;
}

export const getMyWorkingHours = async (
  tenantId: string
): Promise<WorkingHoursResponse[]> => {
  const { data } = await api.get<WorkingHoursResponse[]>(
    `/working-hours/${tenantId}/me`
  );
  return data;
};

export const setWorkingHours = async (
  tenantId: string,
  body: SetWorkingHoursRequest
): Promise<WorkingHoursResponse[]> => {
  const { data } = await api.put<WorkingHoursResponse[]>(
    `/working-hours/${tenantId}`,
    body
  );
  return data;
};

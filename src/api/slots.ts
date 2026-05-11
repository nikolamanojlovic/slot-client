import api from "../lib/axios";

export interface Slot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface SlotTime {
  from: string;
  to: string;
}

export type TimeBucket = "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT";

export type SlotsByDay = Record<string, Record<TimeBucket, SlotTime[]>>;

export const getAvailableSlots = async (
  tenantId: string,
  expertiseId: string,
  professionalId: string,
  date: string,
): Promise<Slot[]> => {
  const { data } = await api.get<Slot[]>("/slots/available", {
    params: { tenantId, expertiseId, professionalId, date },
  });
  return data;
};

export const getSlots = async (
  professionalExternalId: string,
  from: string,
  to: string,
  duration: number,
): Promise<SlotsByDay> => {
  const { data } = await api.get<SlotsByDay>("/slots", {
    params: { professionalExternalId, from, to, duration },
  });
  return data;
};

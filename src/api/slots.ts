import api from "../lib/axios";

export interface Slot {
  id: string;
  startTime: string;
  endTime: string;
}

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

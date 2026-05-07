import api from "../lib/axios";

export interface ProfessionalUser {
  id: string;
  externalId: string;
  firstName: string;
  lastName: string;
}

export const getProfessionals = async (ids: string[]): Promise<ProfessionalUser[]> => {
  const { data } = await api.get<ProfessionalUser[]>("/users/professionals", {
    params: { ids: ids.join(",") },
  });
  return data;
};

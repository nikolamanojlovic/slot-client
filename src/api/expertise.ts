import api from "../lib/axios";
import { ExpertiseResponse } from "../types/api/expertise/expertise.interface";

export const getMyExpertises = async (): Promise<ExpertiseResponse> => {
  const { data } = await api.get<ExpertiseResponse>("/expertises/me", {
    params: { size: 100 },
  });
  return data;
};

export const getExpertise = async (tenantId: string): Promise<ExpertiseResponse> => {
  const { data } = await api.get<ExpertiseResponse>(`/expertises/${tenantId}`, {
    params: { size: 100 },
  });
  return data;
};

export interface CreateExpertiseRequest {
  tenantId: string;
  name: string;
  description: string;
  duration: number;
  capacity: number;
  categories: string[];
  professionals: string[];
}

export const createExpertise = async (body: CreateExpertiseRequest): Promise<void> => {
  await api.post("/expertises", body);
};

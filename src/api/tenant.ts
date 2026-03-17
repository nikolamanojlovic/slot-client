import api from "../lib/axios";
import type { TenantResponse } from "../types/api/tenant/tenant.interface";

export const getTenant = async (tenantId: string): Promise<TenantResponse> => {
  const { data } = await api.get<TenantResponse>(`/tenants/${tenantId}`);
  return data;
};

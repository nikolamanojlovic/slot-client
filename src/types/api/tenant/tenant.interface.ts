export enum TenantType {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
}

export interface TenantResponse {
  id: string;
  name: string;
  type: TenantType;
}

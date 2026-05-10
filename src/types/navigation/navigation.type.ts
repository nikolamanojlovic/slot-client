import { Expertise } from "@/src/types/api/expertise/expertise.interface";
import { TenantType } from "@/src/types/api/tenant/tenant.interface";

export type RootStackParamList = {
  home: undefined;
  explore: undefined;
  'professional-expertises': undefined;
  'professional-expertises-create': { tenantId: string; professionalId: string };
  'professional-expertises-edit': { expertise: Expertise };
  profile: undefined;
  'professional-schedule': undefined;
  'professional-schedule-week': { week: import("@/src/api/scheduleTemplates").WeekResponse; templateId: string };
  'professional-analytics': undefined;
  tenant: { tenantId: string };
  scheduling: { tenantId: string; tenantType: TenantType; expertise: Expertise };
  checkEmail: undefined;
};

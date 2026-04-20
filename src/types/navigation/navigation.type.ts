import { Expertise } from "@/src/types/api/expertise/expertise.interface";

export type RootStackParamList = {
  home: undefined;
  explore: undefined;
  'professional-expertises': undefined;
  'professional-expertises-create': { tenantId: string; professionalId: string };
  'professional-expertises-edit': { expertise: Expertise };
  profile: undefined;
  tenant: { tenantId: string };
  checkEmail: undefined;
};

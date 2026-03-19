import { TenantResponse } from "../tenant/tenant.interface";
import { UserRole } from "./user.enum";

export interface UserDetails {
  id: string;
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  tenant: TenantResponse | null;
}

import { UserRole } from "./user.enum";

export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  tenant: string | null;
}

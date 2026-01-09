import { UserDetails } from "../user/user.types";

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  data: UserDetails;
}

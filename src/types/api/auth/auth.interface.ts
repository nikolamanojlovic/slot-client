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

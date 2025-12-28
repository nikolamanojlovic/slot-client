import api from "../../../lib/axios";
import { supabase } from "../../../lib/supabase";
import type { SignInRequest, SignUpRequest } from "./auth.interface";

export const signUp = async (data: SignUpRequest): Promise<void> => {
  await api.post("/auth/signup", {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    role: data.role,
  });
};

export const signIn = async (data: SignInRequest): Promise<unknown> => {
  return await supabase.auth.signInWithPassword(data);
};

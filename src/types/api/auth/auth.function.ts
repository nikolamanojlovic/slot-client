import { AuthError, Session } from "@supabase/supabase-js";
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

export const getMe = async (): Promise<void> => {
  await api.get("/users/me");
};

export const getSession = async (): Promise<{
  session: Session | null;
  error: AuthError | null;
}> => {
  const { data, error } = await supabase.auth.getSession();
  return {
    session: data.session,
    error: error,
  };
};

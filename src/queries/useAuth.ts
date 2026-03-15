import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../types/common/error.interface";
import type {
  SignInRequest,
  SignUpRequest,
} from "../types/api/auth/auth.interface";
import { signIn, signOut, signUp } from "../api/auth";

export const useAuth = () => {
  const signInMutation = useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    SignInRequest
  >({
    mutationFn: signIn,
  });

  const signUpMutation = useMutation<
    void,
    AxiosError<ErrorResponse>,
    SignUpRequest
  >({
    mutationFn: signUp,
  });

  const signOutMutation = useMutation({
    mutationFn: signOut,
  });

  return {
    signUp: signUpMutation.mutate,
    signIn: signInMutation.mutate,
    signOut: signOutMutation.mutate,

    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,

    signUpError: signUpMutation.error,
    signInError: signInMutation.error,
    signOutError: signOutMutation.error,

    isSignedIn: signInMutation.isSuccess,
    isSignedUp: signUpMutation.isSuccess,
    isSignedOut: signOutMutation.isSuccess,
  };
};

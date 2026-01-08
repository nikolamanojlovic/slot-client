import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../types/common/error.interface";
import type {
  SignInRequest,
  SignUpRequest,
} from "../types/api/auth/auth.interface";
import { getMe, signIn, signUp } from "../types/api/auth/auth.function";

export const useAuth = () => {
  const signInMutation = useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    SignInRequest
  >({
    mutationFn: signIn,
    onSuccess: async () => {
      await getMe();
    },
  });

  const signUpMutation = useMutation<
    void,
    AxiosError<ErrorResponse>,
    SignUpRequest
  >({
    mutationFn: signUp,
  });

  return {
    signUp: signUpMutation.mutate,
    signIn: signInMutation.mutate,

    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,

    signUpError: signUpMutation.error,
    signInError: signInMutation.error,

    isSignedIn: signInMutation.isSuccess,
  };
};

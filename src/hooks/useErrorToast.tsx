import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/src/types/common/error.interface";

const ERROR_CODE_MESSAGES: Record<string, string> = {
  "validation.error": "Please check your input and try again.",
};

export const useErrorToast = () => {
  const toast = useToast();

  const showError = (error: AxiosError<ErrorResponse>) => {
    const code = error.response?.data?.code;
    const message =
      (code && ERROR_CODE_MESSAGES[code]) ??
      error.response?.data?.message ??
      "Something went wrong.";

    const toastId = `toast-${Date.now()}`;
    toast.show({
      id: toastId,
      placement: "top",
      duration: 3000,
      render: () => (
        <Toast nativeID={toastId} action="error" variant="solid" className="mt-5">
          <ToastDescription>{message}</ToastDescription>
        </Toast>
      ),
    });
  };

  return { showError };
};

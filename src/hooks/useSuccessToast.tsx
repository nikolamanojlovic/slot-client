import { Toast, ToastDescription, useToast } from "@/components/ui/toast";

export const useSuccessToast = () => {
  const toast = useToast();

  const showSuccess = (message: string) => {
    const toastId = `toast-${Date.now()}`;
    toast.show({
      id: toastId,
      placement: "top",
      duration: 3000,
      render: () => (
        <Toast nativeID={toastId} action="success" variant="solid" className="mt-5">
          <ToastDescription>{message}</ToastDescription>
        </Toast>
      ),
    });
  };

  return { showSuccess };
};

import { useStartConversation } from "../queries/useMessages";
import { useAppNavigation } from "./useAppNavigation";
import { useErrorToast } from "./useErrorToast";

// Opens the conversation with a professional, creating it on first contact
export const useMessageProfessional = () => {
  const navigation = useAppNavigation();
  const { showError } = useErrorToast();
  const { mutate, isPending } = useStartConversation();

  const messageProfessional = (professionalExternalId: string) =>
    mutate(professionalExternalId, {
      onSuccess: (thread) =>
        navigation.navigate("thread", { threadId: thread.id }),
      onError: (error) =>
        showError(error, {
          "service.unavailable": "Messaging is temporarily unavailable",
        }),
    });

  return { messageProfessional, isPending };
};

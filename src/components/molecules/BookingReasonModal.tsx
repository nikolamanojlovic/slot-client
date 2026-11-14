import { useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { colors } from "@/src/constants/colors";

const MAX_REASON_LENGTH = 500;

// Declining a request: the reason is optional. Cancelling a confirmed booking:
// the reason is required, the client has already planned around it.
const MODES = {
  decline: {
    title: "Decline booking",
    prompt: "You can tell the client why you're declining.",
    submitLabel: "Decline",
    reasonRequired: false,
  },
  cancel: {
    title: "Cancel booking",
    prompt: "Provide a reason for cancelling. The client will see it.",
    submitLabel: "Cancel booking",
    reasonRequired: true,
  },
} as const;

export type BookingReasonMode = keyof typeof MODES;

interface Props {
  // null keeps the popup closed
  mode: BookingReasonMode | null;
  onClose: () => void;
  // reason is undefined when left blank (decline only)
  onSubmit: (reason?: string) => void;
}

const BookingReasonModal = ({ mode, onClose, onSubmit }: Props) => {
  const [reason, setReason] = useState("");
  // Keep the last mode while the popup animates closed
  const [lastMode, setLastMode] = useState<BookingReasonMode>("decline");
  if (mode && mode !== lastMode) setLastMode(mode);
  const { title, prompt, submitLabel, reasonRequired } = MODES[mode ?? lastMode];
  const canSubmit = !reasonRequired || reason.trim().length > 0;

  const close = () => {
    setReason("");
    onClose();
  };

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(reason.trim() || undefined);
    setReason("");
  };

  return (
    <Modal isOpen={mode !== null} onClose={close} avoidKeyboard>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="font-bold" style={{ color: colors.primary, fontSize: 16 }}>
            {title}
          </Text>
        </ModalHeader>
        <ModalBody>
          <Text size="sm" className="mb-3" style={{ color: colors.textSecondary }}>
            {prompt}
          </Text>
          <Input size="md" style={{ borderColor: colors.borderStrong, height: 96 }}>
            <InputField
              placeholder={reasonRequired ? "Reason (required)" : "Reason (optional)"}
              value={reason}
              onChangeText={setReason}
              maxLength={MAX_REASON_LENGTH}
              multiline
              textAlignVertical="top"
              autoFocus
            />
          </Input>
        </ModalBody>
        <ModalFooter>
          <HStack space="sm" className="flex-1">
            <Button
              variant="outline"
              className="flex-1"
              style={{ borderColor: colors.borderStrong }}
              onPress={close}
            >
              <ButtonText style={{ color: colors.textSecondary }}>Back</ButtonText>
            </Button>
            <Button
              className="flex-1"
              isDisabled={!canSubmit}
              style={{ backgroundColor: colors.error, opacity: canSubmit ? 1 : 0.4 }}
              onPress={submit}
            >
              <ButtonText style={{ color: colors.white }}>{submitLabel}</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BookingReasonModal;

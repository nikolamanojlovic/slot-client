import { useState } from "react";
import { Pressable } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { colors } from "@/src/constants/colors";
import TimeSpinner from "./TimeSpinner";

const STEPS = [1, 5, 10] as const;
type Step = (typeof STEPS)[number];

interface Props {
  isOpen: boolean;
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

const TimeModal = ({ isOpen, value, onChange, onClose }: Props) => {
  const [pending, setPending] = useState<Date>(value);
  const [step, setStep] = useState<Step>(1);

  const handleOk = () => {
    onChange(pending);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <HStack className="flex-1 items-center justify-center">
            <HStack style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 6, overflow: "hidden" }}>
              {STEPS.map((s, i) => (
                <Pressable
                  key={s}
                  onPress={() => setStep(s)}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    backgroundColor: step === s ? colors.primary : "#f9fafb",
                    borderLeftWidth: i > 0 ? 1 : 0,
                    borderLeftColor: "#e5e7eb",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: step === s ? "#fff" : "#6b7280",
                    }}
                  >
                    {s}
                  </Text>
                </Pressable>
              ))}
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalBody>
          <TimeSpinner value={pending} step={step} onChange={setPending} />
        </ModalBody>
        <ModalFooter>
          <HStack space="sm" className="flex-1 justify-end">
            <Button style={{ backgroundColor: "#4B5563" }} onPress={onClose}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button style={{ backgroundColor: colors.primary }} onPress={handleOk}>
              <ButtonText>OK</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TimeModal;

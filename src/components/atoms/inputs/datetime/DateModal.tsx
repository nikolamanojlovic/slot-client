import { useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { colors } from "@/src/constants/colors";
import DatePicker from "./DatePicker";

interface Props {
  isOpen: boolean;
  value: Date;
  range?: boolean;
  isDisabled?: (date: Date) => boolean;
  onChange: (date: Date) => void;
  onClose: () => void;
}

const DateModal = ({ isOpen, value, range = false, isDisabled, onChange, onClose }: Props) => {
  const [pending, setPending] = useState<Date>(value);

  const handleOk = () => {
    onChange(pending);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalBody>
          <DatePicker value={pending} range={range} onChange={setPending} isDisabled={isDisabled} />
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

export default DateModal;

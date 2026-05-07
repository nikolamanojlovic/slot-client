import { useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import type { DateTimeType } from "@/src/utils/date";
import { colors } from "@/src/constants/colors";
import DatePicker from "./DatePicker";

const modalTitle: Record<DateTimeType, string> = {
  date: "Select Date",
  time: "Select Time",
  datetime: "Select Date & Time",
};

interface Props {
  isOpen: boolean;
  mode: DateTimeType;
  value: Date;
  range: boolean;
  onChange: (date: Date) => void;
  onClose: () => void;
  isDisabled?: (date: Date) => boolean;
}

const DateTimeFieldModal = ({
  isOpen,
  mode,
  value,
  range,
  onChange,
  onClose,
  isDisabled,
}: Props) => {
  const [pending, setPending] = useState<Date>(value);

  const handleOk = () => {
    onChange(pending);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">{modalTitle[mode]}</Heading>
        </ModalHeader>
        <ModalBody>
          {mode === "date" && (
            <DatePicker value={pending} range={range} onChange={setPending} isDisabled={isDisabled} />
          )}
          {mode === "time" && null /* TimePicker */}
          {mode === "datetime" && null /* DateTimePicker */}
        </ModalBody>
        <ModalFooter>
          <HStack space="sm" className="flex-1 justify-end">
            <Button style={{ backgroundColor: "#4B5563" }} onPress={onClose}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              style={{ backgroundColor: colors.primary }}
              onPress={handleOk}
            >
              <ButtonText>OK</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DateTimeFieldModal;

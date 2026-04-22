import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { colors } from "@/src/constants/colors";

interface TimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  disabled?: boolean;
}

export const TimePicker = ({ value, onChange, disabled }: TimePickerProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable disabled={disabled} onPress={() => setVisible(true)}>
        <Text style={{ color: disabled ? "#aaa" : colors.black }}>
          {value ? value.toTimeString().slice(0, 5) : ""}
        </Text>
      </Pressable>
      <DateTimePickerModal
        isVisible={visible}
        mode="time"
        date={value ?? new Date()}
        is24Hour
        onConfirm={(d) => {
          onChange(d);
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      />
    </>
  );
};

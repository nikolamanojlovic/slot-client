import { useState } from "react";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { formatByMode, type DateTimeType } from "@/src/utils/date";
import DateTimeFieldIcon from "./DateTimeFieldIcon";
import DateTimeFieldModal from "./DateTimeFieldModal";

interface Props {
  mode: DateTimeType;
  value: Date;
  onChange: (date: Date) => void;
  range?: boolean;
  isDisabled?: (date: Date) => boolean;
}

const DateTimeField = ({ mode, value, onChange, range = false, isDisabled }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        className="border border-background-300 rounded h-10 px-3 flex-row items-center justify-between bg-white"
      >
        <Text
          className="text-typography-900 flex-shrink overflow-hidden whitespace-nowrap"
          style={{ textOverflow: "clip" } as any}
          numberOfLines={1}
          ellipsizeMode="clip"
        >
          {formatByMode(value, mode)}
        </Text>
        <DateTimeFieldIcon mode={mode} style={{ marginLeft: 2 }} />
      </Pressable>
      <DateTimeFieldModal
        isOpen={isOpen}
        mode={mode}
        value={value}
        range={range}
        onClose={() => setIsOpen(false)}
        onChange={onChange}
        isDisabled={isDisabled}
      />
    </>
  );
};

export default DateTimeField;

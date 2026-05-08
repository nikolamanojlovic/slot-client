import { useState } from "react";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { formatByMode } from "@/src/utils/date";
import DateTimeFieldIcon from "./DateTimeFieldIcon";
import DateTimeFieldModal from "./DateTimeFieldModal";

type CommonProps = {
  value: Date;
  size?: "sm" | "md";
  onChange: (date: Date) => void;
};

type DateProps = CommonProps & {
  mode: "date";
  range?: boolean;
  isDisabled?: (date: Date) => boolean;
};

type TimeProps = CommonProps & {
  mode: "time";
};

type DateTimeProps = CommonProps & {
  mode: "datetime";
  range?: boolean;
  isDisabled?: (date: Date) => boolean;
};

type Props = DateProps | TimeProps | DateTimeProps;

const DateTimeField = (props: Props) => {
  const { mode, value, onChange, size = "md" } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        className={`border border-background-300 rounded px-2 flex-row items-center justify-between bg-white ${size === "sm" ? "h-6" : "h-10 px-3"}`}
        style={size === "sm" ? { width: 70 } : undefined}
      >
        <Text
          className={`text-typography-900 flex-shrink overflow-hidden whitespace-nowrap ${size === "sm" ? "text-xs" : "text-sm"}`}
          style={{ textOverflow: "clip" } as any}
        >
          {formatByMode(value, mode)}
        </Text>
        <DateTimeFieldIcon
          mode={mode}
          size={size === "sm" ? "xs" : "sm"}
          style={{ marginLeft: 2 }}
        />
      </Pressable>

      <DateTimeFieldModal
        {...props}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default DateTimeField;

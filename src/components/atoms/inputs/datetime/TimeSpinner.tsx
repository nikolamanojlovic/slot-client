import { useState, useEffect, useRef } from "react";
import { View, Pressable, TextInput, Text } from "react-native";
import { Icon } from "@/components/ui/icon";
import { ChevronUp, ChevronDown } from "lucide-react-native";
import { colors } from "@/src/constants/colors";

interface Props {
  value: Date;
  step?: number;
  onChange: (date: Date) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

interface SpinnerColumnProps {
  value: number;
  max: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: (n: number) => void;
}

const SpinnerColumn = ({ value, max, onIncrement, onDecrement, onChange }: SpinnerColumnProps) => {
  const [text, setText] = useState(pad(value));
  const [isFocused, setIsFocused] = useState(false);
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setText(pad(value));
  }, [value]);

  const handleChangeText = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    setText(digits);
    const n = parseInt(digits, 10);
    if (!isNaN(n)) {
      onChange(Math.min(n, max));
    }
  };

  const handleFocus = () => {
    focused.current = true;
    setIsFocused(true);
    setText("");
  };

  const handleBlur = () => {
    focused.current = false;
    setIsFocused(false);
    setText(pad(value));
  };

  return (
    <View style={{ alignItems: "center", gap: 12 }}>
      <Pressable onPress={onIncrement} hitSlop={12}>
        {({ pressed }) => (
          <Icon
            as={ChevronUp}
            size="xl"
            style={{ color: pressed ? colors.primary : "#6b7280" }}
          />
        )}
      </Pressable>

      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: isFocused ? colors.primary : "#e5e7eb",
          backgroundColor: "#f9fafb",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextInput
          value={text}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus
          style={{
            fontSize: 28,
            fontWeight: "600",
            color: colors.primary,
            textAlign: "center",
            width: "100%",
            // @ts-ignore — fontVariant is valid on RN but not typed on web
            fontVariant: ["tabular-nums"],
            outline: "none",
          } as any}
        />
      </View>

      <Pressable onPress={onDecrement} hitSlop={12}>
        {({ pressed }) => (
          <Icon
            as={ChevronDown}
            size="xl"
            style={{ color: pressed ? colors.primary : "#6b7280" }}
          />
        )}
      </Pressable>
    </View>
  );
};

const TimeSpinner = ({ value, step = 1, onChange }: Props) => {
  const hours = value.getHours();
  const minutes = value.getMinutes();

  const update = (h: number, m: number) => {
    const d = new Date(value);
    d.setHours(((h % 24) + 24) % 24, ((m % 60) + 60) % 60, 0, 0);
    onChange(d);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        paddingVertical: 8,
      }}
    >
      <SpinnerColumn
        value={hours}
        max={23}
        onIncrement={() => update(hours + step, minutes)}
        onDecrement={() => update(hours - step, minutes)}
        onChange={(h) => update(h, minutes)}
      />

      <Text style={{ fontSize: 28, fontWeight: "700", color: "#374151", marginBottom: 2 }}>
        :
      </Text>

      <SpinnerColumn
        value={minutes}
        max={59}
        onIncrement={() => update(hours, minutes + step)}
        onDecrement={() => update(hours, minutes - step)}
        onChange={(m) => update(hours, m)}
      />
    </View>
  );
};

export default TimeSpinner;

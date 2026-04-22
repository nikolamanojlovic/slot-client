import { colors } from "@/src/constants/colors";

interface TimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  disabled?: boolean;
}

const toInputValue = (date: Date | null) => {
  if (!date) return "";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

export const TimePicker = ({ value, onChange, disabled }: TimePickerProps) => {
  if (disabled) return null;

  return (
    <input
      type="time"
      value={toInputValue(value)}
      onChange={(e) => {
        const [h, m] = e.target.value.split(":").map(Number);
        if (isNaN(h) || isNaN(m)) return;
        const d = new Date();
        d.setHours(h, m, 0, 0);
        onChange(d);
      }}
      style={{
        color: colors.black,
        border: "none",
        outline: "none",
        background: "transparent",
        fontFamily: "inherit",
        fontSize: "inherit",
        cursor: "pointer",
        textAlign: "center",
        width: "100%",
      }}
    />
  );
};

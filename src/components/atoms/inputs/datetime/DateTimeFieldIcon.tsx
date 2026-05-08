import { Icon } from "@/components/ui/icon";
import { CalendarDays, CalendarClock, Clock2 } from "lucide-react-native";
import type { DateTimeType } from "@/src/utils/date";
import { ViewStyle } from "react-native";

const icon: Record<DateTimeType, typeof CalendarDays> = {
  date: CalendarDays,
  time: Clock2,
  datetime: CalendarClock,
};

interface Props {
  mode: DateTimeType;
  style?: ViewStyle;
  size?: "xs" | "sm";
}

const DateTimeFieldIcon = ({ mode, style, size = "sm" }: Props) => (
  <Icon as={icon[mode]} size={size} className="text-background-500" style={style} />
);

export default DateTimeFieldIcon;

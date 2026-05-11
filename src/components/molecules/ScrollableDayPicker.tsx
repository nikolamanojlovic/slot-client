import { useMemo } from "react";
import { ScrollView, Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react-native";
import { cardStyle } from "@/src/constants/styles";
import { colors } from "@/src/constants/colors";
import {
  formatDateISO,
  DAY_LABELS,
  MONTH_SHORT_LABELS,
  MONTHS,
  CURRENT_YEAR,
} from "@/src/utils/date";

interface Props {
  activeDate: Date;
  onSelect: (date: Date) => void;
  month: number; // 0-indexed
  year: number;
  onMonthChange: (month: number, year: number) => void;
  disabledDates?: Set<string>;
}

const getDatesForMonth = (year: number, month: number): Date[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();
  const startDay = isCurrentMonth ? today.getDate() : 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dates: Date[] = [];
  for (let d = startDay; d <= daysInMonth; d++) {
    dates.push(new Date(year, month, d));
  }
  return dates;
};

const ScrollableDayPicker = ({
  activeDate,
  onSelect,
  month,
  year,
  onMonthChange,
  disabledDates,
}: Props) => {
  const today = new Date();
  const currentMonth = today.getMonth();

  const availableMonths = useMemo(
    () =>
      MONTHS.slice(currentMonth).map((name) => ({ label: name, value: name })),
    [currentMonth],
  );

  const dates = useMemo(() => getDatesForMonth(year, month), [year, month]);
  const activeDateStr = formatDateISO(activeDate);

  return (
    <View>
      <Select
        selectedValue={MONTHS[month]}
        onValueChange={(val) =>
          onMonthChange(MONTHS.indexOf(val), CURRENT_YEAR)
        }
      >
        <SelectTrigger variant="outline" size="md">
          <SelectInput
            placeholder="Month"
            className="text-primary-500 font-semibold"
          />
          <SelectIcon className="mr-3" as={ChevronDown} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {availableMonths.map((m) => (
              <SelectItem key={m.value} label={m.label} value={m.value} />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="grow-0 py-3"
        contentContainerStyle={{ gap: 8 }}
      >
        {dates.map((date) => {
          const dateStr = formatDateISO(date);
          const isActive = dateStr === activeDateStr;
          const isDisabled = disabledDates?.has(dateStr) ?? false;

          return (
            <Pressable
              key={dateStr}
              onPress={() => !isDisabled && onSelect(date)}
              className="rounded-md py-2 px-3 items-center justify-center w-14 h-[72px]"
              style={[
                isDisabled && { opacity: 0.35 },
                isActive ? { backgroundColor: colors.primary } : cardStyle,
              ]}
            >
              <Text
                className={`text-xs font-medium ${isActive ? "text-white" : "text-gray-400"}`}
              >
                {DAY_LABELS[(date.getDay() + 6) % 7]}
              </Text>
              <Text
                className={`text-base font-bold ${isActive ? "text-white" : "text-primary-500"}`}
              >
                {date.getDate()}
              </Text>
              <Text
                className={`text-xs ${isActive ? "text-white" : "text-gray-400"}`}
              >
                {MONTH_SHORT_LABELS[date.getMonth()]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ScrollableDayPicker;

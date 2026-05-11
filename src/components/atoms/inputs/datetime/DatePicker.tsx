import { useState } from "react";
import { Pressable, View } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
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
import { Icon } from "@/components/ui/icon";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { MONTHS, CURRENT_YEAR, DAY_LABELS } from "@/src/utils/date";

interface Props {
  value: Date;
  range: boolean;
  onChange: (date: Date) => void;
  minYear?: number;
  maxYear?: number;
  isDisabled?: (date: Date) => boolean;
}

const DatePicker = ({
  value,
  onChange,
  minYear = CURRENT_YEAR,
  maxYear = CURRENT_YEAR + 10,
  isDisabled,
}: Props) => {
  const initial = value ?? new Date();
  const [year, setYear] = useState(String(initial.getFullYear()));
  const [month, setMonth] = useState(initial.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(
    isDisabled && isDisabled(initial) ? null : initial.getDate(),
  );

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) =>
    String(minYear + i),
  );

  const daysInMonth = new Date(Number(year), month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(Number(year), month, 1).getDay() + 6) % 7;
  const filled = Array.from({ length: firstDayOfWeek + daysInMonth }, (_, i) =>
    i < firstDayOfWeek ? null : i - firstDayOfWeek + 1,
  );
  const cells = Array.from({ length: 42 }, (_, i) => filled[i] ?? null);

  const handleYearChange = (val: string) => {
    setYear(val);
    const updated = new Date(value);
    updated.setFullYear(Number(val));
    onChange(updated);
  };

  const handlePrevMonth = () => {
    const prev = month === 0 ? 11 : month - 1;
    setMonth(prev);
    setSelectedDay(null);
    const updated = new Date(value);
    updated.setMonth(prev);
    onChange(updated);
  };

  const handleNextMonth = () => {
    const next = month === 11 ? 0 : month + 1;
    setMonth(next);
    setSelectedDay(null);
    const updated = new Date(value);
    updated.setMonth(next);
    onChange(updated);
  };

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
    const updated = new Date(value);
    updated.setFullYear(Number(year));
    updated.setMonth(month);
    updated.setDate(day);
    onChange(updated);
  };

  return (
    <VStack space="md">
      <HStack space="sm">
        <Select
          selectedValue={year}
          onValueChange={handleYearChange}
          className="flex-1"
        >
          <SelectTrigger variant="outline" size="md">
            <SelectInput placeholder="Year" />
            <SelectIcon className="mr-3">
              <Icon as={ChevronDown} />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {years.map((y) => (
                <SelectItem key={y} label={y} value={y} />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </HStack>

      <HStack className="items-center justify-between">
        <Pressable onPress={handlePrevMonth} hitSlop={8}>
          <Icon as={ChevronLeft} size="sm" style={{ color: colors.primary }} />
        </Pressable>
        <Text
          style={{ color: colors.primary, fontWeight: "700", fontSize: 16 }}
        >
          {MONTHS[month]}
        </Text>
        <Pressable onPress={handleNextMonth} hitSlop={8}>
          <Icon as={ChevronRight} size="sm" style={{ color: colors.primary }} />
        </Pressable>
      </HStack>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {DAY_LABELS.map((d) => (
          <View
            key={d}
            style={{
              width: "14.28%",
              alignItems: "center",
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "600", color: "#9ca3af" }}>
              {d}
            </Text>
          </View>
        ))}
        {cells.map((day, i) => {
          const date = day !== null ? new Date(Number(year), month, day) : null;
          const disabled =
            date !== null && isDisabled ? isDisabled(date) : false;
          return (
            <View
              key={i}
              style={{
                width: "14.28%",
                alignItems: "center",
                paddingVertical: 2,
                height: 36,
                justifyContent: "center",
              }}
            >
              {day !== null && (
                <Pressable
                  onPress={() => !disabled && handleDayPress(day)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      selectedDay === day ? colors.primary : "transparent",
                    opacity: disabled ? 0.3 : 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "500",
                      color: selectedDay === day ? "#fff" : colors.primary,
                    }}
                  >
                    {day}
                  </Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </View>
    </VStack>
  );
};

export default DatePicker;

import { useMemo, useState } from "react";
import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import ScrollableDayPicker from "@/src/components/molecules/ScrollableDayPicker";
import SlotGrid from "@/src/components/molecules/SlotGrid";
import MoreThanMonthAheadAlert from "@/src/components/molecules/alerts/MoreThanMonthAheadAlert";
import { getSlots, SlotTime } from "@/src/api/slots";
import { formatDateISO } from "@/src/utils/date";

export interface SlotSelection {
  date: string; // yyyy-MM-dd
  slot: SlotTime;
}

interface Props {
  // Undefined while it's still loading; no slots are fetched until then
  professionalId: string | undefined;
  expertiseId: string | undefined;
  duration: number; // minutes
  selection: SlotSelection | null;
  // null when the day or month changes
  onChange: (selection: SlotSelection | null) => void;
}

// Pick a day (from today) and one of its free slots. Shared by the booking
// flow's Select Date step and rescheduling a booking.
const SlotPicker = ({ professionalId, expertiseId, duration, selection, onChange }: Props) => {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [activeDate, setActiveDate] = useState<Date>(today);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    setActiveDate(isCurrentMonth ? today : new Date(year, month, 1));
    onChange(null);
  };

  const dateStr = formatDateISO(activeDate);

  const { data: slotsData, isLoading } = useQuery({
    queryKey: ["slots", professionalId, expertiseId, dateStr, duration],
    queryFn: () => getSlots(professionalId!, expertiseId!, dateStr, dateStr, duration),
    enabled: !!professionalId && !!expertiseId,
  });

  const isMoreThanMonthAhead = useMemo(() => {
    const oneMonthFromNow = new Date(today);
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    return activeDate > oneMonthFromNow;
  }, [activeDate, today]);

  return (
    <View className="flex-1">
      <ScrollableDayPicker
        activeDate={activeDate}
        month={selectedMonth}
        year={selectedYear}
        onMonthChange={handleMonthChange}
        onSelect={(date) => {
          setActiveDate(date);
          onChange(null);
        }}
      />

      {isMoreThanMonthAhead && <MoreThanMonthAheadAlert />}

      <View className="flex-1">
        <SlotGrid
          buckets={slotsData?.[dateStr]}
          isLoading={isLoading}
          selectedFrom={selection?.date === dateStr ? selection.slot.from : null}
          onSelect={(slot) => onChange({ date: dateStr, slot })}
        />
      </View>
    </View>
  );
};

export default SlotPicker;

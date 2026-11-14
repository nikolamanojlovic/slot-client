import { useMemo, useState } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { RootStackParamList } from "@/src/types/navigation/navigation.type";
import BasicStepLayout from "@/src/components/BasicStepLayout";
import ScrollableDayPicker from "@/src/components/molecules/ScrollableDayPicker";
import SlotGrid from "@/src/components/molecules/SlotGrid";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { colors } from "@/src/constants/colors";
import { getBooking } from "@/src/api/bookings";
import { getSlots, SlotTime } from "@/src/api/slots";
import { useRescheduleBooking } from "@/src/queries/useBookings";
import { formatDateISO, formatDayMonth, parseDateISO } from "@/src/utils/date";
import { formatTimeRange } from "@/src/utils/schedule";
import { useErrorToast } from "@/src/hooks/useErrorToast";
import type { ErrorResponse } from "@/src/types/common/error.interface";

const MAX_REASON_LENGTH = 500;

type Props = NativeStackScreenProps<RootStackParamList, "booking-reschedule">;

const minutesBetween = (start: string, end: string): number => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
};

// The professional picks a new day and slot for a confirmed booking. The
// booking keeps its duration and stays confirmed; the client isn't asked.
const RescheduleBookingScreen = ({ route, navigation }: Props) => {
  const { bookingId, threadId, basedOnMessageId } = route.params;

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [activeDate, setActiveDate] = useState<Date>(today);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedSlot, setSelectedSlot] = useState<SlotTime | null>(null);
  const [reason, setReason] = useState("");

  const { data: booking, isLoading: isBookingLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId),
  });
  const duration = booking ? minutesBetween(booking.startTime, booking.endTime) : 0;

  const dateStr = formatDateISO(activeDate);
  const { data: slotsData, isLoading: isSlotsLoading } = useQuery({
    queryKey: ["slots", booking?.professionalExternalId, booking?.expertiseExternalId, dateStr, duration],
    queryFn: () =>
      getSlots(booking!.professionalExternalId, booking!.expertiseExternalId, dateStr, dateStr, duration),
    enabled: !!booking,
  });

  const { mutate: reschedule, isPending } = useRescheduleBooking();
  const { showError } = useErrorToast();

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    setActiveDate(isCurrentMonth ? today : new Date(year, month, 1));
    setSelectedSlot(null);
  };

  const submit = () => {
    if (!booking || !selectedSlot) return;
    reschedule(
      {
        bookingId,
        date: dateStr,
        startTime: selectedSlot.from.slice(0, 5),
        endTime: selectedSlot.to.slice(0, 5),
        reason: reason.trim() || undefined,
      },
      {
        onSuccess: (updated) =>
          navigation.navigate({
            name: "thread",
            params: {
              threadId,
              rescheduled: {
                booking: updated,
                basedOnMessageId,
                previous: {
                  date: booking.date,
                  startTime: booking.startTime,
                  endTime: booking.endTime,
                },
              },
            },
            merge: true,
          }),
        onError: (error: AxiosError<ErrorResponse>) =>
          showError(error, {
            "booked.slot.capacity.exceeded": "This slot was just taken. Pick another one.",
            "booking.reschedule.invalid": "Pick a different time.",
            "booking.status.invalid": "This booking can no longer be rescheduled.",
          }),
      },
    );
  };

  return (
    <BasicStepLayout title="Reschedule" onCancel={() => navigation.goBack()}>
      {isBookingLoading || !booking ? (
        <Spinner size="large" color={colors.black} className="mt-8" />
      ) : (
        <View className="flex-1" style={{ gap: 8 }}>
          <Text size="sm" style={{ color: colors.textSecondary }}>
            Now: {formatDayMonth(parseDateISO(booking.date))},{" "}
            {formatTimeRange(booking.startTime, booking.endTime)}
          </Text>

          <ScrollableDayPicker
            activeDate={activeDate}
            month={selectedMonth}
            year={selectedYear}
            onMonthChange={handleMonthChange}
            onSelect={(date) => {
              setActiveDate(date);
              setSelectedSlot(null);
            }}
          />

          <View className="flex-1">
            <SlotGrid
              buckets={slotsData?.[dateStr]}
              isLoading={isSlotsLoading}
              selectedFrom={selectedSlot?.from ?? null}
              onSelect={setSelectedSlot}
            />
          </View>

          <Input size="md" style={{ borderColor: colors.borderStrong, height: 72 }}>
            <InputField
              placeholder="Reason (optional)"
              value={reason}
              onChangeText={setReason}
              maxLength={MAX_REASON_LENGTH}
              multiline
              textAlignVertical="top"
            />
          </Input>

          <Button
            onPress={submit}
            isDisabled={!selectedSlot || isPending}
            className="mb-4"
            style={{ backgroundColor: selectedSlot ? colors.primary : colors.disabled }}
          >
            <ButtonText style={{ color: colors.white }}>Reschedule</ButtonText>
          </Button>
        </View>
      )}
    </BasicStepLayout>
  );
};

export default RescheduleBookingScreen;

import { useState } from "react";
import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { X } from "lucide-react-native";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
} from "@/components/ui/drawer";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import SlotPicker, { type SlotSelection } from "@/src/components/molecules/SlotPicker";
import { colors } from "@/src/constants/colors";
import { getBooking, type BookingResponse } from "@/src/api/bookings";
import { useRescheduleBooking } from "@/src/queries/useBookings";
import { useErrorToast } from "@/src/hooks/useErrorToast";
import { formatDayMonth, parseDateISO } from "@/src/utils/date";
import { formatTimeRange } from "@/src/utils/schedule";
import { queryClient } from "@/src/lib/query";
import type { ErrorResponse } from "@/src/types/common/error.interface";

const MAX_REASON_LENGTH = 500;

export interface BookingTime {
  date: string;
  startTime: string;
  endTime: string;
}

interface Props {
  // null keeps the drawer closed
  bookingId: string | null;
  onClose: () => void;
  // previous: the time before the move, for the struck-through line on the card
  onRescheduled: (booking: BookingResponse, previous: BookingTime) => void;
  // 409 booking.status.invalid: the booking changed meanwhile (e.g. cancelled)
  onStale: () => void;
}

const minutesBetween = (start: string, end: string): number => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
};

// The form lives in its own component so it unmounts with the drawer and
// every opening starts fresh (today, no slot, no reason)
const RescheduleForm = ({
  bookingId,
  onRescheduled,
  onStale,
}: { bookingId: string } & Pick<Props, "onRescheduled" | "onStale">) => {
  const [selection, setSelection] = useState<SlotSelection | null>(null);
  const [reason, setReason] = useState("");
  const { showError } = useErrorToast();
  const { mutate: reschedule, isPending } = useRescheduleBooking();

  const { data: booking } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId),
  });

  if (!booking) {
    return <Spinner size="large" color={colors.black} className="mt-8" />;
  }

  const submit = () => {
    if (!selection) return;
    const { date, slot } = selection;
    reschedule(
      {
        bookingId,
        date,
        startTime: slot.from.slice(0, 5),
        endTime: slot.to.slice(0, 5),
        reason: reason.trim() || undefined,
      },
      {
        onSuccess: (updated) => {
          queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
          onRescheduled(updated, {
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
          });
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          const code = error.response?.data?.code;
          if (code === "booking.status.invalid") onStale();
          if (code === "booked.slot.capacity.exceeded") {
            setSelection(null);
            queryClient.invalidateQueries({ queryKey: ["slots"] });
          }
          showError(error, {
            "booked.slot.capacity.exceeded": "This slot was just taken. Pick another one.",
            "booking.reschedule.invalid": "Pick a different time.",
            "booking.status.invalid": "This booking has already changed.",
            "booking.forbidden": "Only the booked professional can do this.",
            "booking.not.found": "This booking no longer exists.",
          });
        },
      },
    );
  };

  return (
    <View className="flex-1" style={{ gap: 8 }}>
      <Text size="sm" style={{ color: colors.textSecondary }}>
        Now: {formatDayMonth(parseDateISO(booking.date))},{" "}
        {formatTimeRange(booking.startTime, booking.endTime)}
      </Text>

      <SlotPicker
        professionalId={booking.professionalExternalId}
        expertiseId={booking.expertiseExternalId}
        duration={minutesBetween(booking.startTime, booking.endTime)}
        selection={selection}
        onChange={setSelection}
      />

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
        isDisabled={!selection || isPending}
        style={{ backgroundColor: selection ? colors.primary : colors.disabled }}
      >
        <ButtonText style={{ color: colors.white }}>Reschedule</ButtonText>
      </Button>
    </View>
  );
};

// The professional moves a confirmed booking to another day and slot. Same
// picker as the booking flow, without its basket and confirmation step. The
// booking keeps its duration and stays confirmed; the client isn't asked.
const RescheduleBookingDrawer = ({ bookingId, onClose, onRescheduled, onStale }: Props) => {
  // Keep the last booking while the drawer animates closed
  const [lastBookingId, setLastBookingId] = useState(bookingId);
  if (bookingId && bookingId !== lastBookingId) setLastBookingId(bookingId);

  return (
    <Drawer isOpen={bookingId !== null} onClose={onClose} size="lg" anchor="bottom">
      <DrawerBackdrop />
      <DrawerContent style={{ paddingBottom: 24 }}>
        <DrawerHeader className="mb-2">
          <Text className="font-bold" style={{ color: colors.primary, fontSize: 16 }}>
            Reschedule
          </Text>
          <DrawerCloseButton>
            <X size={20} color={colors.textMuted} />
          </DrawerCloseButton>
        </DrawerHeader>
        {lastBookingId && (
          <RescheduleForm
            bookingId={lastBookingId}
            onRescheduled={onRescheduled}
            onStale={onStale}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default RescheduleBookingDrawer;

import { View } from "react-native";
import { CalendarClock, CalendarDays, Check, Clock, X } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import type { BookingData, BookingStatus } from "@/src/api/messages";
import { formatDayMonth, parseDateISO } from "@/src/utils/date";
import { formatTimeRange } from "@/src/utils/schedule";
import { bookingMessageParts, type BookingViewer } from "@/src/utils/bookingMessage";
import { cardStyle } from "@/src/constants/styles";
import { colors } from "@/src/constants/colors";

const STATUS_TITLE: Record<BookingStatus, string> = {
  REQUESTED: "Booking requested",
  CONFIRMED: "Booking confirmed",
  DECLINED: "Booking rejected",
};

// Shown instead of the action buttons; only a declined booking has one
const STATUS_BADGE: Partial<Record<BookingStatus, { label: string; color: string }>> = {
  DECLINED: { label: "Declined", color: colors.error },
};

export interface BookingCardActions {
  onConfirm: () => void;
  onDecline: () => void;
  // A request in flight. Both are also disabled once the booking is answered;
  // the buttons stay so the card keeps its size
  disabled: boolean;
}

interface Props {
  data: BookingData;
  // Who is reading: decides the sentence ("You confirmed …" / "… confirmed your booking")
  viewer: BookingViewer;
  // An older card of a booking that has a newer one: faded, no badge
  faded?: boolean;
  // The professional's Confirm/Decline: active on the newest request,
  // disabled on an older one
  actions?: BookingCardActions;
  // The Reschedule button on the newest confirmed card. No reschedule
  // endpoint yet, so it does nothing until onReschedule is passed.
  showReschedule?: boolean;
  onReschedule?: () => void;
}

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const badge = STATUS_BADGE[status];
  if (!badge) return null;
  return (
    <View
      style={{
        alignSelf: "flex-end",
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: badge.color,
      }}
    >
      <Text size="2xs" className="font-semibold" style={{ color: colors.white }}>
        {badge.label}
      </Text>
    </View>
  );
};

const When = ({ data }: { data: BookingData }) => (
  <HStack space="md" className="items-center">
    <HStack space="xs" className="items-center">
      <CalendarDays size={14} color={colors.textMuted} />
      <Text size="sm" style={{ color: colors.textSecondary }}>
        {formatDayMonth(parseDateISO(data.date))}
      </Text>
    </HStack>
    <HStack space="xs" className="items-center">
      <Clock size={14} color={colors.textMuted} />
      <Text size="sm" style={{ color: colors.textSecondary }}>
        {formatTimeRange(data.startTime, data.endTime)}
      </Text>
    </HStack>
  </HStack>
);

const Bold = ({ children }: { children: string }) => (
  <Text size="sm" className="font-semibold" style={{ color: colors.text }}>
    {children}
  </Text>
);

// react-native View (not gluestack Box): on web Box is a plain <div>, which
// drops RN-only style props like shadow*
const BookingCard = ({
  data,
  viewer,
  faded = false,
  actions,
  showReschedule = false,
  onReschedule,
}: Props) => {
  const title = STATUS_TITLE[data.status] ?? "Booking";
  const parts = bookingMessageParts(data, viewer);

  return (
    <View
      style={{
        ...cardStyle,
        width: "100%",
        padding: 14,
        borderRadius: 10,
        gap: 6,
        opacity: faded ? 0.55 : 1,
      }}
    >
      <Text size="sm" className="font-bold" style={{ color: colors.primary }}>
        {title}
      </Text>
      <Text size="sm" style={{ color: colors.text }}>
        {parts
          ? parts.map((part, i) =>
              part.bold ? <Bold key={i}>{part.text}</Bold> : part.text,
            )
          : (data.expertiseName ?? "Booking")}
      </Text>
      <When data={data} />
      {data.status === "DECLINED" && !!data.reason && (
        <Text size="sm" className="italic" style={{ color: colors.textSecondary }}>
          {data.reason}
        </Text>
      )}
      {showReschedule ? (
        // Same button height as Confirm/Decline
        <Button
          size="sm"
          className="mt-2"
          style={{ backgroundColor: colors.warning, gap: 6 }}
          onPress={onReschedule}
        >
          <CalendarClock size={18} color={colors.white} />
          <ButtonText style={{ color: colors.white }}>Reschedule</ButtonText>
        </Button>
      ) : actions ? (
        <HStack space="sm" className="mt-2">
          <Button
            size="sm"
            className="flex-1"
            isDisabled={actions.disabled || data.status !== "REQUESTED"}
            style={{ backgroundColor: colors.success, gap: 6 }}
            onPress={actions.onConfirm}
          >
            <Check size={18} color={colors.white} />
            <ButtonText style={{ color: colors.white }}>Confirm</ButtonText>
          </Button>
          <Button
            size="sm"
            accessibilityLabel="Decline"
            isDisabled={actions.disabled || data.status !== "REQUESTED"}
            style={{ backgroundColor: colors.error, width: 44, paddingHorizontal: 0 }}
            onPress={actions.onDecline}
          >
            <X size={18} color={colors.white} />
          </Button>
        </HStack>
      ) : (
        !faded && <StatusBadge status={data.status} />
      )}
    </View>
  );
};

// A BOOKING message without booking data (e.g. from before messages carried
// it), so there's nothing to show or act on
export const BrokenBookingCard = () => (
  <View
    style={{
      ...cardStyle,
      width: "100%",
      padding: 14,
      borderRadius: 10,
      gap: 6,
      // Faded like an older card: there's nothing to act on
      opacity: 0.55,
    }}
  >
    <Text size="sm" className="font-bold" style={{ color: colors.primary }}>
      {STATUS_TITLE.REQUESTED}
    </Text>
    <Text size="sm" style={{ color: colors.textSecondary }}>
      Something went wrong with this booking.
    </Text>
  </View>
);

export default BookingCard;

import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import type { BookingState, UserBookingResponse } from "@/src/api/bookings";
import { useBookings } from "@/src/queries/useBookings";
import { useUserStore } from "@/src/stores/useUserStore";
import { UserRole } from "@/src/types/api/user/user.enum";
import { formatDateISO } from "@/src/utils/date";
import { participantName } from "@/src/utils/participant";
import { colors } from "@/src/constants/colors";

const MAX_SHOWN = 3;
// Enough to cover a full day, so the ones already over can be dropped client-side
const PAGE_SIZE = 50;
const STATES: BookingState[] = ["PENDING", "CONFIRMED"];

const BLOCK_STYLE: Partial<Record<BookingState, { accent: string; background: string }>> = {
  PENDING: { accent: colors.neutral, background: colors.bookingPendingBg },
  CONFIRMED: { accent: colors.primary, background: colors.bookingConfirmedBg },
};

// "HH:mm:ss" → minutes since midnight
const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// One calendar event: time, type, and the other person
const BookingRow = ({
  item,
  otherFallback,
}: {
  item: UserBookingResponse;
  otherFallback: string;
}) => {
  const { booking, otherParticipant } = item;
  const style = BLOCK_STYLE[booking.status] ?? BLOCK_STYLE.PENDING!;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Text size="xs" style={{ color: colors.textSecondary }}>
        {booking.startTime.slice(0, 5)}-{booking.endTime.slice(0, 5)}
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          borderRadius: 4,
          borderLeftWidth: 3,
          borderLeftColor: style.accent,
          backgroundColor: style.background,
          paddingHorizontal: 8,
          paddingVertical: 6,
        }}
      >
        <Text
          size="xs"
          numberOfLines={1}
          className="font-semibold"
          style={{ flex: 1, color: style.accent }}
        >
          {booking.expertiseName ?? "Session"}
        </Text>
        <Text
          size="xs"
          numberOfLines={1}
          style={{ flexShrink: 1, color: colors.textSecondary }}
        >
          {participantName(otherParticipant, otherFallback)}
        </Text>
      </View>
    </View>
  );
};

// Today's next few pending/confirmed bookings, for clients and professionals alike
const TodayBookings = () => {
  const isProfessional = useUserStore((s) => s.user?.role === UserRole.PROFESSIONAL);
  // The phone's local date: near midnight the server's (UTC) today can differ
  const today = formatDateISO(new Date());
  const { data, isLoading } = useBookings({
    from: today,
    to: today,
    state: STATES,
    size: PAGE_SIZE,
  });

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const upcoming = (data?.content ?? [])
    .filter(({ booking }) => toMinutes(booking.endTime) > nowMinutes)
    .slice(0, MAX_SHOWN);

  return (
    <VStack space="xs" className="mt-2">
      <Heading size="md" className="mb-2" style={{ color: colors.text }}>
        Upcoming
      </Heading>
      {isLoading ? (
        <Spinner color={colors.primary} />
      ) : upcoming.length === 0 ? (
        <Text size="sm" style={{ color: colors.textMuted }}>
          No more bookings today
        </Text>
      ) : (
        upcoming.map((item) => (
          <BookingRow
            key={item.booking.id}
            item={item}
            otherFallback={isProfessional ? "Client" : "Professional"}
          />
        ))
      )}
    </VStack>
  );
};

export default TodayBookings;

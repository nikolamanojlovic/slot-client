import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SchedulingStackParamList } from "@/src/navigation/SchedulingStack";
import { useScheduling } from "@/src/context/SchedulingContext";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import BasicNavigationLayout from "@/src/components/BasicNavigationLayout";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { colors } from "@/src/constants/colors";
import { useQuery } from "@tanstack/react-query";
import { getBooking } from "@/src/api/bookings";
import { Send } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { useMessageProfessional } from "@/src/hooks/useMessageProfessional";

type Props = NativeStackScreenProps<SchedulingStackParamList, "confirmation">;

const Row = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between py-2">
    <Text className="text-sm" style={{ color: colors.textMuted }}>
      {label}
    </Text>
    <Text className="text-sm font-medium" style={{ color: colors.text }}>
      {value}
    </Text>
  </View>
);

const SchedulingConfirmationScreen = (_: Props) => {
  const { tenantName, expertise, professionalId, professionalName, bookingId } =
    useScheduling();
  const rootNavigation = useAppNavigation();
  const { messageProfessional, isPending: isStarting } =
    useMessageProfessional();

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId!),
    enabled: !!bookingId,
  });

  return (
    <BasicNavigationLayout
      title="Confirmation"
      onBack={() => rootNavigation.navigate("home")}
    >
      <View className="flex-1">
        {isLoading || !booking ? (
          <Spinner size="large" color={colors.black} className="flex-1" />
        ) : (
          <>
            <View className="items-center py-6">
              <Send size={56} color={colors.primary} />
              <Text
                className="text-lg font-bold mt-3"
                style={{ color: colors.primary }}
              >
                Your request has been sent!
              </Text>
            </View>

            <View className="gap-1">
              <Row label="Tenant" value={tenantName} />
              <Row label="Expertise" value={expertise.name} />
              <Row label="Provider" value={professionalName ?? tenantName} />
              <Row label="Date" value={booking.date} />
              <Row
                label="Time"
                value={`${booking.startTime.slice(0, 5)} – ${booking.endTime.slice(0, 5)}`}
              />
              <Row label="Status" value={booking.status} />
            </View>
          </>
        )}

        <View className="flex-1" />

        {professionalId && (
          <Button
            onPress={() => messageProfessional(professionalId)}
            isDisabled={isStarting}
            className="mb-4"
            style={{ backgroundColor: isStarting ? colors.disabled : colors.primary }}
          >
            <ButtonText style={{ color: colors.white }}>
              Message {professionalName ?? tenantName}
            </ButtonText>
          </Button>
        )}
      </View>
    </BasicNavigationLayout>
  );
};

export default SchedulingConfirmationScreen;

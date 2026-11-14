import { useState } from "react";
import { View } from "react-native";
import BasicStepLayout from "@/src/components/BasicStepLayout";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import { useScheduling } from "@/src/context/SchedulingContext";
import { Button, ButtonText } from "@/components/ui/button";
import { Fab, FabIcon } from "@/components/ui/fab";
import { colors } from "@/src/constants/colors";
import { ShoppingBasket } from "lucide-react-native";
import SchedulingProgressOverviewActionSheet from "@/src/components/molecules/sheets/SchedulingProgressOverviewActionSheet";
import SlotPicker, { type SlotSelection } from "@/src/components/molecules/SlotPicker";
import { useMutation } from "@tanstack/react-query";
import { createBooking } from "@/src/api/bookings";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SchedulingStackParamList } from "@/src/navigation/SchedulingStack";

const SchedulingSelectDateScreen = () => {
  const {
    tenantId,
    tenantName,
    expertise,
    professionalId,
    professionalName,
    setSelectedDate,
    setSelectedSlot,
    setBookingId,
  } = useScheduling();
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [selection, setSelection] = useState<SlotSelection | null>(null);
  const rootNavigation = useAppNavigation();
  const navigation = useNavigation<NativeStackNavigationProp<SchedulingStackParamList>>();

  const { mutate: book, isPending: isBooking } = useMutation({
    mutationFn: ({ date, slot }: SlotSelection) => createBooking({
      tenantId,
      expertiseId: expertise.id,
      professionalExternalId: professionalId!,
      date,
      startTime: slot.from,
      endTime: slot.to,
    }),
    onSuccess: (bookingId, { date, slot }) => {
      setSelectedDate(date);
      setSelectedSlot({ id: slot.from, startTime: slot.from, endTime: slot.to });
      setBookingId(bookingId);
      navigation.navigate("confirmation", undefined);
    },
  });

  const handleContinue = () => selection && book(selection);

  return (
    <BasicStepLayout
      title="Select Date"
      onCancel={() => rootNavigation.navigate("tenant", { tenantId })}
    >
      <View className="flex-1">
        <SlotPicker
          professionalId={professionalId ?? undefined}
          expertiseId={expertise.id}
          duration={expertise.duration}
          selection={selection}
          onChange={setSelection}
        />

        <Button
          onPress={handleContinue}
          isDisabled={!selection || isBooking}
          className="mb-4"
          style={{ backgroundColor: selection ? colors.primary : colors.disabled }}
        >
          <ButtonText style={{ color: colors.white }}>Continue</ButtonText>
        </Button>

        <Fab
          placement="bottom right"
          style={{ backgroundColor: colors.primary, bottom: 72 }}
          onPress={() => setOverviewOpen(true)}
        >
          <FabIcon as={ShoppingBasket} />
        </Fab>

        <SchedulingProgressOverviewActionSheet
          isOpen={overviewOpen}
          onClose={() => setOverviewOpen(false)}
          expertiseName={expertise.name}
          tenantName={tenantName}
          professionalName={professionalName}
          duration={expertise.duration}
          price={expertise.price}
        />
      </View>
    </BasicStepLayout>
  );
};

export default SchedulingSelectDateScreen;

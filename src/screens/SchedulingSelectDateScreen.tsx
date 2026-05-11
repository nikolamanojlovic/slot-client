import { useState, useMemo } from "react";
import { ScrollView, View, Pressable } from "react-native";
import BasicStepLayout from "@/src/components/BasicStepLayout";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import { useScheduling } from "@/src/context/SchedulingContext";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Spinner } from "@/components/ui/spinner";
import { colors } from "@/src/constants/colors";
import { ShoppingBasket } from "lucide-react-native";
import MoreThanMonthAheadAlert from "@/src/components/molecules/alerts/MoreThanMonthAheadAlert";
import SchedulingProgressOverviewActionSheet from "@/src/components/molecules/sheets/SchedulingProgressOverviewActionSheet";
import { formatDateISO } from "@/src/utils/date";
import ScrollableDayPicker from "@/src/components/molecules/ScrollableDayPicker";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSlots, TimeBucket, SlotTime } from "@/src/api/slots";
import { createBooking } from "@/src/api/bookings";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SchedulingStackParamList } from "@/src/navigation/SchedulingStack";

const BUCKET_LABELS: Record<TimeBucket, string> = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
  NIGHT: "Night",
};

const BUCKET_ORDER: TimeBucket[] = ["MORNING", "AFTERNOON", "EVENING", "NIGHT"];

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
    selectedSlot,
  } = useScheduling();
  const [overviewOpen, setOverviewOpen] = useState(false);
  const rootNavigation = useAppNavigation();
  const navigation = useNavigation<NativeStackNavigationProp<SchedulingStackParamList>>();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [activeDate, setActiveDate] = useState<Date>(today);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear] = useState(today.getFullYear());

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    const isCurrentMonth =
      year === today.getFullYear() && month === today.getMonth();
    const firstDay = isCurrentMonth ? today : new Date(year, month, 1);
    setActiveDate(firstDay);
    setSelectedSlot(null);
  };

  const dateStr = formatDateISO(activeDate);

  const { data: slotsData, isLoading } = useQuery({
    queryKey: ["slots", professionalId, dateStr, expertise.duration],
    queryFn: () =>
      getSlots(professionalId!, dateStr, dateStr, expertise.duration),
    enabled: !!professionalId,
  });

  const buckets = slotsData?.[dateStr];

  const isMoreThanMonthAhead = useMemo(() => {
    const oneMonthFromNow = new Date(today);
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    return activeDate > oneMonthFromNow;
  }, [activeDate, today]);

  const handleSlotPress = (slot: SlotTime) => {
    setSelectedSlot({ id: slot.from, startTime: slot.from, endTime: slot.to });
  };

  const { mutate: book, isPending: isBooking } = useMutation({
    mutationFn: () => createBooking({
      tenantId,
      expertiseId: expertise.id,
      professionalExternalId: professionalId!,
      date: dateStr,
      startTime: selectedSlot!.startTime,
      endTime: selectedSlot!.endTime,
    }),
    onSuccess: (bookingId) => {
      setSelectedDate(dateStr);
      setBookingId(bookingId);
      navigation.navigate("confirmation", undefined);
    },
  });

  const handleContinue = () => book();

  return (
    <BasicStepLayout
      title="Select Date"
      onCancel={() => rootNavigation.navigate("tenant", { tenantId })}
    >
      <View className="flex-1">
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

        {isMoreThanMonthAhead && <MoreThanMonthAheadAlert />}

        <View className="flex-1">
          {isLoading ? (
            <Spinner size="large" color="black" className="mt-8" />
          ) : !buckets || BUCKET_ORDER.every((b) => !buckets[b]?.length) ? (
            <View className="flex-1 items-center justify-center">
              <Text style={{ color: "#888", fontSize: 15 }}>
                No available slots
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 16, paddingVertical: 8 }}
            >
              {BUCKET_ORDER.filter((bucket) => buckets[bucket]?.length > 0).map(
                (bucket) => (
                  <View key={bucket}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: colors.primary,
                        marginBottom: 8,
                      }}
                    >
                      {BUCKET_LABELS[bucket]}
                    </Text>
                    <View
                      style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                    >
                      {buckets[bucket].map((slot) => {
                        const isSelected = selectedSlot?.id === slot.from;
                        return (
                          <Pressable
                            key={slot.from}
                            onPress={() => handleSlotPress(slot)}
                            style={{
                              borderRadius: 6,
                              paddingVertical: 8,
                              paddingHorizontal: 14,
                              alignItems: "center",
                              backgroundColor: colors.white,
                              borderWidth: 1,
                              borderColor: isSelected
                                ? colors.primary
                                : "#d1d5db",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: "600",
                                color: isSelected ? colors.primary : "#555",
                              }}
                            >
                              {slot.from.slice(0, 5)}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                ),
              )}
            </ScrollView>
          )}
        </View>

        <Button
          onPress={handleContinue}
          isDisabled={!selectedSlot || isBooking}
          className="mb-4"
          style={{ backgroundColor: selectedSlot ? colors.primary : "#ccc" }}
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

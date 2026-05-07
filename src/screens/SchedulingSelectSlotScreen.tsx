import { View, Pressable, FlatList } from "react-native";
import BasicStepLayout from "@/src/components/BasicStepLayout";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import { useScheduling } from "@/src/context/SchedulingContext";
import { useQuery } from "@tanstack/react-query";
import { getAvailableSlots, Slot } from "@/src/api/slots";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { Button, ButtonText } from "@/components/ui/button";
import { cardStyle } from "@/src/constants/styles";
import { colors } from "@/src/constants/colors";

const formatTime = (iso: string): string => {
  const d = new Date(iso);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

const SchedulingSelectSlotScreen = () => {
  const { tenantId, expertise, professionalId, selectedDate, setSelectedSlot, selectedSlot } =
    useScheduling();
  const rootNavigation = useAppNavigation();

  const { data: slots, isLoading } = useQuery({
    queryKey: ["slots", professionalId, expertise.id, selectedDate],
    queryFn: () =>
      getAvailableSlots(tenantId, expertise.id, professionalId!, selectedDate!),
    enabled: !!professionalId && !!selectedDate,
  });

  const handleContinue = () => {
    // navigate to confirmation screen
  };

  return (
    <BasicStepLayout
      title="Select Time"
      onCancel={() => rootNavigation.navigate("tenant", { tenantId })}
    >
      <View className="flex-1">
        <View className="flex-1">
          {isLoading ? (
            <Spinner size="large" color="black" className="mt-8" />
          ) : !slots || slots.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text style={{ color: "#888", fontSize: 15 }}>
                No available slots for this day
              </Text>
            </View>
          ) : (
            <FlatList
              data={slots}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={{ gap: 8 }}
              contentContainerStyle={{ gap: 8, paddingTop: 12, paddingBottom: 16 }}
              renderItem={({ item }) => {
                const isSelected = selectedSlot?.id === item.id;
                return (
                  <Pressable
                    onPress={() =>
                      setSelectedSlot({ id: item.id, startTime: item.startTime, endTime: item.endTime })
                    }
                    style={[
                      {
                        flex: 1,
                        borderRadius: 10,
                        paddingVertical: 12,
                        alignItems: "center",
                      },
                      isSelected
                        ? { backgroundColor: colors.primary }
                        : { backgroundColor: colors.white, ...cardStyle },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: isSelected ? colors.white : colors.primary,
                      }}
                    >
                      {formatTime(item.startTime)}
                    </Text>
                  </Pressable>
                );
              }}
            />
          )}
        </View>

        <Button
          onPress={handleContinue}
          isDisabled={!selectedSlot}
          className="mb-4"
          style={{ backgroundColor: selectedSlot ? colors.primary : "#ccc" }}
        >
          <ButtonText style={{ color: colors.white }}>Continue</ButtonText>
        </Button>
      </View>
    </BasicStepLayout>
  );
};

export default SchedulingSelectSlotScreen;

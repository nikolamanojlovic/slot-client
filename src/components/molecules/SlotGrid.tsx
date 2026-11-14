import { ScrollView, View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { colors } from "@/src/constants/colors";
import type { SlotTime, TimeBucket } from "@/src/api/slots";

const BUCKET_LABELS: Record<TimeBucket, string> = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
  NIGHT: "Night",
};

const BUCKET_ORDER: TimeBucket[] = ["MORNING", "AFTERNOON", "EVENING", "NIGHT"];

interface Props {
  // One day of GET /slots; undefined when the day has none
  buckets: Record<TimeBucket, SlotTime[]> | undefined;
  isLoading: boolean;
  // slot.from of the selected slot
  selectedFrom: string | null;
  onSelect: (slot: SlotTime) => void;
}

// A day's free slots grouped by time of day, used when booking and rescheduling
const SlotGrid = ({ buckets, isLoading, selectedFrom, onSelect }: Props) => {
  if (isLoading) {
    return <Spinner size="large" color={colors.black} className="mt-8" />;
  }

  if (!buckets || BUCKET_ORDER.every((b) => !buckets[b]?.length)) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ color: colors.textMuted, fontSize: 15 }}>No available slots</Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 16, paddingVertical: 8 }}
    >
      {BUCKET_ORDER.filter((bucket) => buckets[bucket]?.length > 0).map((bucket) => (
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
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {buckets[bucket].map((slot) => {
              const isSelected = selectedFrom === slot.from;
              return (
                <Pressable
                  key={slot.from}
                  onPress={() => onSelect(slot)}
                  style={{
                    borderRadius: 6,
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    alignItems: "center",
                    backgroundColor: colors.white,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.primary : colors.borderStrong,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: isSelected ? colors.primary : colors.textSecondary,
                    }}
                  >
                    {slot.from.slice(0, 5)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default SlotGrid;

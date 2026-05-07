import { useState, useMemo } from "react";
import { ScrollView, View, Pressable } from "react-native";
import BasicStepLayout from "@/src/components/BasicStepLayout";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import { useScheduling } from "@/src/context/SchedulingContext";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { cardStyle } from "@/src/constants/styles";
import { colors } from "@/src/constants/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SchedulingStackParamList } from "@/src/navigation/SchedulingStack";

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getUpcomingDates = (count: number): Date[] => {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SchedulingSelectDateScreen = () => {
  const { tenantId, setSelectedDate } = useScheduling();
  const rootNavigation = useAppNavigation();
  const navigation = useNavigation<NativeStackNavigationProp<SchedulingStackParamList>>();

  const dates = useMemo(() => getUpcomingDates(14), []);
  const [activeDate, setActiveDate] = useState<Date>(dates[0]);

  const handleContinue = () => {
    setSelectedDate(formatDate(activeDate));
    navigation.navigate("select-slot");
  };

  return (
    <BasicStepLayout
      title="Select Date"
      onCancel={() => rootNavigation.navigate("tenant", { tenantId })}
    >
      <View className="flex-1">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-3"
          contentContainerStyle={{ gap: 8 }}
        >
          {dates.map((date) => {
            const isActive = formatDate(date) === formatDate(activeDate);
            return (
              <Pressable
                key={formatDate(date)}
                onPress={() => setActiveDate(date)}
                style={[
                  {
                    borderRadius: 12,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    alignItems: "center",
                    minWidth: 52,
                  },
                  isActive
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.white, ...cardStyle },
                ]}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "500",
                    color: isActive ? colors.white : "#888",
                  }}
                >
                  {DAY_LABELS[date.getDay()]}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: isActive ? colors.white : colors.primary,
                  }}
                >
                  {date.getDate()}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "400",
                    color: isActive ? colors.white : "#888",
                  }}
                >
                  {MONTH_LABELS[date.getMonth()]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View className="flex-1" />

        <Button
          onPress={handleContinue}
          className="mb-4"
          style={{ backgroundColor: colors.primary }}
        >
          <ButtonText style={{ color: colors.white }}>Continue</ButtonText>
        </Button>
      </View>
    </BasicStepLayout>
  );
};

export default SchedulingSelectDateScreen;

import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { colors } from "@/src/constants/colors";

interface Props {
  label: string;
  selected?: boolean;
  // Small counter after the label; hidden when 0 or missing
  count?: number;
  // Without it the chip is display-only
  onPress?: () => void;
}

// Rounded pill for filters and tags; gluestack has no chip. A react-native
// Pressable rather than gluestack Button, whose sizes and variants bring their
// own height, padding and colors.
const Chip = ({ label, selected = false, count, onPress }: Props) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    accessibilityRole={onPress ? "button" : "text"}
    accessibilityState={{ selected }}
    className="flex-row items-center gap-1.5 rounded-full border px-4 py-1.5"
    style={{
      backgroundColor: selected ? colors.primary : colors.white,
      borderColor: selected ? colors.primary : colors.borderStrong,
    }}
  >
    <Text
      size="sm"
      className="font-semibold"
      style={{ color: selected ? colors.white : colors.textSecondary }}
    >
      {label}
    </Text>
    {!!count && (
      <View
        className="rounded-full px-1.5"
        style={{
          minWidth: 20,
          alignItems: "center",
          backgroundColor: selected ? colors.white : colors.primary,
        }}
      >
        <Text
          size="2xs"
          className="font-bold"
          style={{ color: selected ? colors.primary : colors.white }}
        >
          {count > 99 ? "99+" : count}
        </Text>
      </View>
    )}
  </Pressable>
);

export default Chip;

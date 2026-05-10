import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { colors } from "@/src/constants/colors";
import { cardStyle } from "@/src/constants/styles";

const CardMenuItem = ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Icon>["as"];
  onPress?: () => void;
}) => (
  <Pressable onPress={onPress}>
    <VStack
      className="p-3 rounded-md"
      style={{ ...cardStyle, aspectRatio: 2 }}
    >
      <Text className="font-medium flex-1" style={{ color: colors.primary }}>
        {label}
      </Text>
      <Icon as={icon} size="md" style={{ color: colors.primary, alignSelf: "flex-end" }} />
    </VStack>
  </Pressable>
);

export default CardMenuItem;

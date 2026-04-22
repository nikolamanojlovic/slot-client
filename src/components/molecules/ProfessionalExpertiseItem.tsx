import { Pressable, View } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Badge, BadgeText } from "@/components/ui/badge";
import type { Expertise } from "@/src/types/api/expertise/expertise.interface";
import { colors } from "@/src/constants/colors";
import { cardStyle } from "@/src/constants/styles";
import PriceLabel from "@/src/components/atoms/PriceLabel";

interface Props {
  expertise: Expertise;
  categoryMap: Map<string, string>;
  onPress?: () => void;
}

const ProfessionalExpertiseItem = ({
  expertise,
  categoryMap,
  onPress,
}: Props) => (
  <Pressable onPress={onPress}>
    <HStack
      space="md"
      className="items-center justify-between p-3 rounded-md"
      style={cardStyle}
    >
      <VStack space="xs" className="flex-1">
        <HStack className="justify-between items-center">
          <HStack space="xs" className="items-center">
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: expertise.active ? colors.success : colors.error,
              }}
            />
            <Text className="font-bold ml-1" style={{ color: colors.primary }}>
              {expertise.name}
            </Text>
          </HStack>
          <PriceLabel price={expertise.price} />
        </HStack>
        <Text size="sm" className="text-typography-500">
          {`${expertise.capacity} ${expertise.capacity === 1 ? "person" : "people"}, ${expertise.duration} min`}
        </Text>
        <HStack space="xs" className="flex-wrap mt-3">
          {expertise.categories.map((catId) => (
            <Badge
              key={catId}
              size="sm"
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              }}
            >
              <BadgeText style={{ color: colors.white }}>
                {categoryMap.get(catId) ?? catId}
              </BadgeText>
            </Badge>
          ))}
        </HStack>
      </VStack>
    </HStack>
  </Pressable>
);

export default ProfessionalExpertiseItem;

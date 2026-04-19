import { Pressable } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import type { Expertise } from "@/src/types/api/expertise/expertise.interface";
import { colors } from "@/src/constants/colors";
import PriceLabel from "@/src/components/atoms/PriceLabel";
import { CircleAlert } from "lucide-react-native";

interface Props {
  expertise: Expertise;
  categoryMap: Map<string, string>;
  onPress?: () => void;
}

const ProfessionalExpertiseItem = ({ expertise, categoryMap, onPress }: Props) => (
  <Pressable onPress={onPress}>
  <HStack
    space="md"
    className="items-center justify-between p-3 rounded-md"
    style={{
      backgroundColor: colors.white,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 4,
    }}
  >
    <VStack space="xs" className="flex-1">
      <Alert
        action="error"
        variant="solid"
        className="py-1 px-1 gap-1 items-center"
      >
        <AlertIcon as={CircleAlert} size="xs" />
        <AlertText size="xs" className="font-medium">
          Slots not configured
        </AlertText>
      </Alert>
      <Text className="font-bold" style={{ color: colors.primary }}>
        {expertise.name}
      </Text>
      <Text size="sm" className="text-typography-500">
        {`${expertise.capacity} ${expertise.capacity === 1 ? "person" : "people"}, ${expertise.duration} min`}
      </Text>
      <PriceLabel price={expertise.price} />
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

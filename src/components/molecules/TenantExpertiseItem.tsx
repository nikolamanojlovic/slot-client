import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import type { Expertise } from "@/src/types/api/expertise/expertise.interface";
import { colors } from "@/src/constants/colors";
import { cardStyle } from "@/src/constants/styles";
import PriceLabel from "@/src/components/atoms/PriceLabel";

interface Props {
  expertise: Expertise;
}

const TenantExpertiseItem = ({ expertise }: Props) => (
  <HStack
    space="md"
    className="items-center justify-between p-3 rounded-md"
    style={cardStyle}
  >
    <VStack space="xs" className="flex-1">
      <Text className="font-bold" style={{ color: colors.primary }}>
        {expertise.name}
      </Text>
      <Text size="sm" className="text-typography-500">
        {`${expertise.capacity} ${expertise.capacity === 1 ? "person" : "people"}, ${expertise.duration} min`}
      </Text>
    </VStack>
    <PriceLabel price={expertise.price} />
  </HStack>
);

export default TenantExpertiseItem;

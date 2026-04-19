import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import { colors } from "@/src/constants/colors";
import type { ExploreResponseItemList } from "@/src/types/api/search/search.interface";

interface Props {
  expertise: ExploreResponseItemList;
}

const ExplorePreviewExpertiseItem = ({ expertise }: Props) => (
  <VStack className="mb-2">
    <HStack className="justify-between items-center">
      <VStack className="items-start">
        <Text size="xs" bold>
          {expertise.name}
        </Text>
        <Text size="xs" className="text-typography-500">
          {`${expertise.duration} min | ${expertise.capacity} ppl`}
        </Text>
      </VStack>
      {expertise.price && (
        <Text size="sm" bold style={{ color: colors.primary }}>
          {`${expertise.price.amount} ${expertise.price.currency}`}
        </Text>
      )}
    </HStack>
    <Divider className="mt-2 w-2/5 self-center" />
  </VStack>
);

export default ExplorePreviewExpertiseItem;

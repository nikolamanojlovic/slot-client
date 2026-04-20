import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Star } from "lucide-react-native";
import { colors } from "@/src/constants/colors";

interface Props {
  rating?: number;
}

const Rating = ({ rating }: Props) => (
  <HStack className="items-center" space="xs">
    <Star size={14} color={colors.rating} fill={colors.rating} />
    <Text size="sm" className="font-medium">
      {rating ? rating.toFixed(1) : "N/A"}
    </Text>
  </HStack>
);

export default Rating;

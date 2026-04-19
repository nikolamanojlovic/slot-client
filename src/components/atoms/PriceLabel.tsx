import { Text } from "@/components/ui/text";
import { colors } from "@/src/constants/colors";
import type { Price } from "@/src/types/api/expertise/expertise.interface";

interface Props {
  price: Price | null;
}

const PriceLabel = ({ price }: Props) => {
  if (price) {
    return (
      <Text size="sm" className="font-medium" style={{ color: colors.primary }}>
        {`${price.amount} ${price.currency}`}
      </Text>
    );
  }

  return (
    <Text size="sm" className="font-medium text-error-600">
      NOT PROVIDED
    </Text>
  );
};

export default PriceLabel;

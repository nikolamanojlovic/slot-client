import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { cardStyle } from "@/src/constants/styles";
import { colors } from "@/src/constants/colors";
import type { ProfessionalUser } from "@/src/api/user";

interface Props {
  professional: ProfessionalUser;
  onPress: () => void;
}

const ProfessionalSelectItem = ({ professional, onPress }: Props) => (
  <Pressable onPress={onPress}>
    <HStack
      space="md"
      className="items-center p-3 rounded-md"
      style={cardStyle}
    >
      <Avatar size="sm">
        <AvatarFallbackText>
          {`${professional.firstName[0]}${professional.lastName[0]}`}
        </AvatarFallbackText>
      </Avatar>
      <Text className="font-medium" style={{ color: colors.primary }}>
        {`${professional.firstName} ${professional.lastName}`}
      </Text>
    </HStack>
  </Pressable>
);

export default ProfessionalSelectItem;

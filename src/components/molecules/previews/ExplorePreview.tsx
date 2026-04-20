import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ExploreResponseItem } from "@/src/types/api/search/search.interface";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import { H3 } from "@expo/html-elements";
import { Pressable } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { colors } from "@/src/constants/colors";
import { cardStyle } from "@/src/constants/styles";
import ExplorePreviewExpertiseItem from "@/src/components/molecules/previews/ExplorePreviewExpertiseItem";
import Rating from "@/src/components/atoms/Rating";

interface ExplorePreviewProps {
  preview: ExploreResponseItem;
}

const ExplorePreview = ({ preview }: ExplorePreviewProps) => {
  const navigation = useAppNavigation();
  const dummyImage =
    "https://img.freepik.com/free-photo/strong-man-training-gym_1303-23478.jpg?semt=ais_hybrid&w=740&q=80";

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("tenant", { tenantId: preview.tenantId })
      }
      style={cardStyle}
      className="rounded-md overflow-hidden mb-3 mx-1"
    >
      <Image
        source={{ uri: dummyImage }}
        alt={preview.tenantName}
        className="w-full h-[120px]"
      />
      <VStack className="p-3" space="sm">
        <HStack className="items-center justify-between mb-2">
          <H3 className="m-0" style={{ color: colors.primary }}>
            {preview.tenantName}
          </H3>
          <Rating rating={undefined} />
        </HStack>
        {preview.expertises?.length ? (
          preview.expertises.map((exp, index) => (
            <ExplorePreviewExpertiseItem
              key={exp.id}
              expertise={exp}
              isLast={index === preview.expertises.length - 1}
            />
          ))
        ) : (
          <Text size="sm" className="text-typography-400">
            No expertises
          </Text>
        )}
      </VStack>
    </Pressable>
  );
};

export default ExplorePreview;

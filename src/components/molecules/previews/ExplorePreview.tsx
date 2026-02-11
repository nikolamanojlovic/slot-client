import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ExploreResponseItem } from "@/src/types/api/search/search.interface";
import { H3 } from "@expo/html-elements";
import { Pressable } from "react-native";

interface ExplorePreviewProps {
  preview: ExploreResponseItem;
}

const ExplorePreview = ({ preview }: ExplorePreviewProps) => {
  const dummyImage =
    "https://media.gettyimages.com/id/652628318/photo/caffee-on-table-and-blured-cafe.jpg?s=612x612&w=gi&k=20&c=GjH2_Y3O41125DmnhK0Ecqq3P27MFT455hM8qtp-_zM=";

  return (
    <VStack className="w-full mt-3 mb-3">
      <Pressable className="w-full">
        <Image
          source={{ uri: dummyImage }}
          alt={preview.tenantName}
          className="w-full h-[100px]"
        />
        <VStack className="items-start">
          <H3 className="m-0 mt-3">{preview.tenantName}</H3>
        </VStack>
      </Pressable>
      {preview.expertises?.length ? (
        preview.expertises?.map((exp) => (
          <HStack key={exp.id} className="mt-2 mb-2 p-2 bg-gray-200">
            <VStack>
              <Text size="sm" bold>
                {exp.name}
              </Text>
              <Text size="xs">{`${exp.duration} min | ${exp.capacity} ppl`}</Text>
            </VStack>
          </HStack>
        ))
      ) : (
        <HStack key={Date.now()} className="mt-2 mb-2 p-2 bg-gray-200">
          <VStack>
            <Text size="sm" bold>
              No expertises
            </Text>
          </VStack>
        </HStack>
      )}
    </VStack>
  );
};

export default ExplorePreview;

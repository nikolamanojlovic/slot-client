import BasicLayout from "../components/BasicLayout";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import ExploreSearch from "../components/molecules/ExploreSearch";
import { useQuery } from "@tanstack/react-query";
import { ExploreResponse } from "@/src/types/api/search/search.interface";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/src/types/common/error.interface";
import { explore } from "@/src/api/search";
import { useState } from "react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import ExplorePreview from "../components/molecules/previews/ExplorePreview";
import { ScrollView } from "react-native";

const ExploreScreen = () => {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const debounced = useDebounce(query, 500);

  const { isLoading, data, error } = useQuery<
    ExploreResponse,
    AxiosError<ErrorResponse>
  >({
    queryKey: ["explore", debounced],
    queryFn: () => explore(debounced),
  });

  return (
    <BasicLayout>
      <VStack className="h-full mb-3">
        <HStack className="w-full justify-between">
          <Heading size="2xl" className="text-left text-primary-500 mt-3 mb-3">
            Explore
          </Heading>
        </HStack>
        <ExploreSearch query={query} setQuery={setQuery} />
        {isLoading && (
          <Spinner className="flex-1 m-0" size="large" color="black" />
        )}
        <ScrollView className="flex-1 pt-6 pb-3">
          {data?.items &&
            data.items.map((item) => (
              <ExplorePreview key={item.tenantId} preview={item} />
            ))}
        </ScrollView>
      </VStack>
    </BasicLayout>
  );
};

export default ExploreScreen;

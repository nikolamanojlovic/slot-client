import BasicNavigationLayout from "../components/BasicNavigationLayout";
import { VStack } from "@/components/ui/vstack";
import ExploreSearch from "../components/molecules/search/ExploreSearch";
import { useQuery } from "@tanstack/react-query";
import { ExploreResponse } from "@/src/types/api/search/search.interface";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/src/types/common/error.interface";
import { explore } from "@/src/api/search";
import { useState } from "react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { Spinner } from "@/components/ui/spinner";
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
    <BasicNavigationLayout title="Explore" showBack={false}>
      <VStack className="h-full mb-3">
        <ExploreSearch query={query} setQuery={setQuery} />
        {isLoading && (
          <Spinner className="flex-1 m-0" size="large" color="black" />
        )}
        <ScrollView className="flex-1 pt-1 pb-3">
          {data?.items &&
            data.items.map((item) => (
              <ExplorePreview key={item.tenantId} preview={item} />
            ))}
        </ScrollView>
      </VStack>
    </BasicNavigationLayout>
  );
};

export default ExploreScreen;

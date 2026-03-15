import api from "../lib/axios";
import { ExploreResponse } from "../types/api/search/search.interface";

export const explore = async (
  query: string | undefined,
): Promise<ExploreResponse> => {
  const { data } = await api.post<ExploreResponse>("/search", {
    query: query || null,
    preview: 3,
  });
  return data;
};

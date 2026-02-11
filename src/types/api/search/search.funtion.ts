import api from "@/src/lib/axios";
import { ExploreResponse } from "./search.interface";

export const explore = async (
  query: string | undefined,
): Promise<ExploreResponse> => {
  const { data } = await api.post<ExploreResponse>("/search", {
    query: query || null,
  });
  return data;
};

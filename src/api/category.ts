import api from "../lib/axios";
import type { Category, CategoryTreeResponse } from "../types/api/category/category.interface";

export const getCategoryTree = async (): Promise<CategoryTreeResponse> => {
  const response = await api.get("/categories/tree");
  return response.data;
};

export const getCategoryLeafs = async (ids: string[]): Promise<Category[]> => {
  const { data } = await api.get<Category[]>("/categories/leafs", {
    params: { ids: ids.join(",") },
  });
  return data;
};

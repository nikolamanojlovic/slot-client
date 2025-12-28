import api from "../../../lib/axios";
import type { CategoryTreeResponse } from "./category.interface";

export const getCategoryTree = async (): Promise<CategoryTreeResponse> => {
  const response = await api.get("/categories/tree");
  return response.data;
};

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getCategoryTree } from "@/src/api/category";
import type { CategoryTreeResponse } from "@/src/types/api/category/category.interface";
import type { ErrorResponse } from "@/src/types/common/error.interface";

export const useCategoryTree = () => {
  const { data, isLoading } = useQuery<CategoryTreeResponse, AxiosError<ErrorResponse>>({
    queryKey: ["categories/tree"],
    queryFn: getCategoryTree,
  });

  const superCategories = data?.categories ?? [];

  const categoryMap = useMemo(() => {
    if (!data) return new Map<string, string>();
    return new Map(
      data.categories
        .flatMap((sc) => sc.subcategories)
        .map((c) => [c.id, c.name]),
    );
  }, [data]);

  return { superCategories, categoryMap, isLoading };
};

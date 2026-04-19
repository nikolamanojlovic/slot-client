export interface ExploreResponseItemList {
  id: string;
  name: string;
  description: string;
  duration: number;
  capacity: number;
  categories: string[];
  price: { amount: number; currency: string } | null;
}

export interface ExploreResponseItem {
  tenantId: string;
  tenantName: string;
  expertises: ExploreResponseItemList[];
}

export interface ExploreResponse {
  items: ExploreResponseItem[];
}

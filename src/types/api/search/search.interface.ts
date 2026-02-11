export interface ExploreResponseItemList {
  id: string;
  name: string;
  description: string;
  duration: number;
  capacity: number;
  categories: string[];
}

export interface ExploreResponseItem {
  tenantId: string;
  tenantName: string;
  expertises: ExploreResponseItemList[];
}

export interface ExploreResponse {
  items: ExploreResponseItem[];
}

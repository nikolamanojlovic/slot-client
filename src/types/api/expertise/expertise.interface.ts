export interface Expertise {
  id: string;
  name: string;
  description: string;
  duration: number;
  capacity: number;
  categories: string[];
  active: boolean;
  price: Price | null;
}

export interface Price {
  amount: number;
  currency: string;
}

export interface ExpertiseResponse {
  content: Expertise[];
  totalElements: number;
  totalPages: number;
}

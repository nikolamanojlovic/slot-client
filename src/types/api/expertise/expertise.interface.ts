export interface Expertise {
  id: string;
  name: string;
  description: string;
  duration: number;
  capacity: number;
  categories: string[];
  active: boolean;
}

export interface ExpertiseResponse {
  content: Expertise[];
  totalElements: number;
  totalPages: number;
}

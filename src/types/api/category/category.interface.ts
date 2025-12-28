export interface Category {
  id: string;
  name: string;
}

export interface SuperCategory extends Category {
  subcategories: Category[];
}

export interface CategoryTreeResponse {
  categories: SuperCategory[];
}

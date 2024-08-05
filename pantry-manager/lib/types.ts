export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expirationDate?: string;
  imageUrl?: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
}
export type Category = "cakes" | "cinnabons" | "muffins";

export interface Product {
  id: string;
  name: string;
  category: Category;
  priceMinor: number;
  description: string;
  image: string;
  weight?: string;
  filling?: string;
  prepTime: string;
}

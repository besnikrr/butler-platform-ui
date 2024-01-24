interface BaseItemInterface {
  needs_cutlery: boolean;
  image: string;
  price: number;
  guest_view: boolean;
  name: string;
  raw_food: boolean;
  description: string;
  labels: string[];
  modifiers: ModifierOnItem[];
  image_base_url?: string;
  category_name?: string;
  subcategory_name?: string;
  is_active: boolean;
}

interface ModifierOnItem {
  id?: number;
  name?: string;
  price?: number;
}

export { BaseItemInterface, ModifierOnItem };

import * as yup from "yup";
import { BaseEntity, BaseFilter } from "../base";
import type { HubOnMenu, Item86 } from "./item";

interface MenuEntity extends BaseEntity {
  id?: string;
  name: string;
  type: string;
  status?: string;
  assignedHotels?: number;
  hotels?: HubOnMenu[];
  hasChanges?: boolean;
  published?: boolean;
  published_at?: number;
  categories: {
    [key: string]: CategoryOnMenu | any;
  };
}

type Menu_Category = BaseEntity;
type Menu_Subcategory = BaseEntity;
type Menu_Item = BaseEntity;
interface Menu_Hotel extends BaseEntity {
  id?: string;
  hotel_name?: any;
  hub: HubOnMenu;
  city: CityOnMenu;
  hotel_id?: string;
}

type CityOnMenu = {
  id: string;
  name: string;
};

interface CreateUpdateMenu {
  pk: string;
  type: string;
  name: string;
  published_at: number;
  subcategories: {
    [key in string]: SubcategoryOnMenu;
  };
}

interface BatchEditMenu {
  menus: MenuEntity[];
  subcategories: {
    [key in string]: SubcategoryOnMenu;
  };
}

interface MenuFilter extends BaseFilter {
  name?: string;
  hotels?: string[];
  hotelIds?: string[];
}

interface HubsFilter extends BaseFilter {
  name: string;
}

type CategoryOnMenu = {
  name: string;
  subcategories: {
    [key in string]: SubcategoryOnMenu;
  };
};

type SubcategoryOnMenu = {
  name: string;
  order: number;
  items: {
    [key in string]: ItemOnMenu;
  };
};

type ItemOnMenu = {
  id: string;
  needs_cutlery: boolean;
  image: string;
  is_popular: boolean;
  is_favorite: boolean;
  price: number;
  old_price: number;
  guest_view: boolean;
  name: string;
  raw_food: boolean;
  description: string;
  image_base_url?: string;
  labels?: [];
  subcategory?: string;
  category?: string;
  suggested_items: string[];
  modifiers: ModifierOnMenu[];
  category_name: string;
  subcategory_name: string;
  order: number;
  gs1sk: string;
  gs2sk: string;
  gs3sk: string;
};

interface MenuRelation {
  categoryId: string;
  subcategoryId: string;
  itemId?: string;
}

interface ModifierOnMenu {
  name?: string;
  price?: number;
}

enum MENU_STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

enum MULTIPLY_OPTION {
  ADD = "ADD",
  SUBTRACT = "SUBTRACT",
  MULTIPLY = "MULTIPLY",
}

enum MENU_EVENT {
  UPDATED = "MENU_UPDATED",
  DELETED = "MENU_DELETED",
}

interface Item86HubMenus {
  menuIDs: string[];
  item86s: Item86[];
}

interface MenuHubEntity extends BaseEntity {
  menus: string[];
}

const priceMultiplierValidator = yup.object().shape({
  action: yup
    .mixed<MULTIPLY_OPTION>()
    .oneOf(Object.values(MULTIPLY_OPTION))
    .required("Action is a required field!")
    .label("Action"),
  amount: yup
    .number()
    .positive()
    .required()
    .typeError("Amount is a required field!")
    .label("Amount"),
});

export {
  MenuEntity,
  MenuFilter,
  HubsFilter,
  CreateUpdateMenu,
  SubcategoryOnMenu,
  CategoryOnMenu,
  Menu_Category,
  Menu_Subcategory,
  Menu_Item,
  Menu_Hotel,
  MENU_STATUS,
  MULTIPLY_OPTION,
  ItemOnMenu,
  priceMultiplierValidator,
  MENU_EVENT,
  MenuRelation,
  BatchEditMenu,
  Item86HubMenus,
  MenuHubEntity,
};

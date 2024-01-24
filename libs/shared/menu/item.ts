import * as yup from "yup";
import type { BaseItemInterface } from ".";
import { BaseEntity } from "../base";
import { Category } from "./category";

interface Item extends BaseEntity, BaseItemInterface {
  id?: string;
  item_id?: string;
  subcategories?: { [key: string]: string };
  out_of_stock?: any;
  category?: Category;
  is_active: boolean;
}

interface Item86 extends BaseEntity {
  type?: string;
  menus: string[];
  hub: HubOnMenu;
  end_time: number;
}

interface CreateUpdateItem86 {
  itemID: string;
  hubs: HubOnMenu[];
}

type HubOnMenu = {
  id: string;
  name: string;
  hours?: number;
  days?: number;
  menu_hotel_id?: string;
};

interface CreateItemRequest extends BaseItemInterface {
  subcategories: string[];
}

enum ItemPatchType {
  GENERAL_INFORMATION = "general-information",
  MODIFIERS = "modifiers",
  CATEGORIES = "categories",
}

interface UpdateItemRequest extends CreateItemRequest {
  type: ItemPatchType;
}

interface RelationsOnUpdate {
  result: boolean;
  menuItems: BaseEntity[];
}

interface ItemResponse extends BaseItemInterface {
  id: string;
  configs: ItemConfigs;
}

interface ItemWithKeys extends BaseItemInterface {
  pk: string;
  id?: string;
  sk?: string;
  gs1pk: string;
  gs1sk: string;
  gs2pk: string;
  gs2sk: string;
  gs3pk: string;
  gs3sk: string;
  category_name: string;
  subcategory_name: string;
}
interface CreateUpdateItemInputCategory {
  [x: string]: string[];
}
interface CreateUpdateItemInput extends BaseItemInterface {
  type: string | "ITEM";
  pk: string | "item";
  sk: string;
  gs1pk: string | "item::subcategory"; //
  gs2pk: string | "item::category"; // 'item::category',
  gs3pk: string | "item"; // '',

  gs1sk: string; // 'subcategory::1',
  gs2sk: string; // 'category::1',
  gs3sk: string; // 'item::1',

  categories: CreateUpdateItemInputCategory;
}

export type SubCategoriesOnItem = {
  [key in string]?: string;
} & {
  name?: string;
};

export type ItemConfigs = {
  [key in string]?: CategoriesOnItem;
};

export type CategoriesOnItem = {
  [key in string]?: string;
} & {
  name?: string;
  subcategories: SubCategoriesOnItem[];
};

/**
 * validators
 */
export const DOUBLE_DIGIT_NUMBER_FORMAT_REGEX =
  /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/;
const SUPPORTED_IMG_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const FILE_SIZE = 1 * 1024 * 1024 * 4; // 4MB

const generalInformationValidator = yup
  .object()
  .shape({
    needs_cutlery: yup.boolean().required(),
    guest_view: yup.boolean().required(),
    raw_food: yup.boolean().required(),
    price: yup
      .number()
      .typeError("Item Price is a required field!")
      .required("Item Price is a required field!")
      .test(
        "maxDigitsAfterDecimal",
        `Number field must have 2 digits after decimal or less`,
        (value: any) => DOUBLE_DIGIT_NUMBER_FORMAT_REGEX.test(value.toString())
      ),
    image: yup.mixed().when({
      is: (value: any) => typeof value === "string",
      then: yup.string().required("Image file is a required field!"),
      otherwise: yup
        .mixed()
        .test(
          "name",
          "Image file is a required field!",
          (value) => !value || (value && value.name)
        )
        .test(
          "size",
          "The uploaded file is too big, the maximum supported image size is 4MB.",
          (value) => !value || (value && value.size <= FILE_SIZE)
        )
        .test(
          "type",
          "Uploaded file has an unsupported format, the supported image formats are: jpg, jpeg, png",
          (value) =>
            !value || (value && SUPPORTED_IMG_FORMATS.includes(value.type))
        )
        .required("Image file is a required field!"),
    }),
    name: yup.string().required("Item Name is a required field!"),
    description: yup.string().trim().max(500).optional().nullable(),
    labels: yup.array().of(yup.string()).optional(),
  })
  .required();

const updateItemModifiersValidator = yup
  .object()
  .shape({
    modifiers: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.string().required(),
          name: yup.string().required(),
        })
      )
      .required(),
  })
  .required();

// TODO switch categories
const updateItemSubcategoriesValidator = yup
  .object()
  .shape({
    subcategories: yup.array().of(yup.string()).required(),
  })
  .required();

enum ITEM_EVENT {
  DELETED = "ITEM_DELETED",
  UPDATED = "ITEM_UPDATED",
  MODIFIER_UPDATED = "ITEM_MODIFIER_UPDATED",
}

/**
 * exports
 */

export type { Item };
export {
  CreateUpdateItemInput,
  CreateItemRequest,
  UpdateItemRequest,
  ItemWithKeys,
  ItemResponse,
  ItemPatchType,
  ITEM_EVENT,
  updateItemSubcategoriesValidator,
  generalInformationValidator,
  updateItemModifiersValidator,
  RelationsOnUpdate,
  Item86,
  CreateUpdateItem86,
  HubOnMenu,
};

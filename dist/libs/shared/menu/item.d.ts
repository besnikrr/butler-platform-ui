import type { BaseItemInterface } from ".";
import { BaseEntity } from "../base";
interface Item extends BaseEntity, BaseItemInterface {
    id?: string;
    item_id?: string;
    subcategories?: {
        [key: string]: string;
    };
    out_of_stock?: any;
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
declare type HubOnMenu = {
    id: string;
    name: string;
    hours?: number;
    days?: number;
    menu_hotel_id?: string;
};
interface CreateItemRequest extends BaseItemInterface {
    subcategories: string[];
}
declare enum ItemPatchType {
    GENERAL_INFORMATION = "general-information",
    MODIFIERS = "modifiers",
    CATEGORIES = "categories"
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
    gs1pk: string | "item::subcategory";
    gs2pk: string | "item::category";
    gs3pk: string | "item";
    gs1sk: string;
    gs2sk: string;
    gs3sk: string;
    categories: CreateUpdateItemInputCategory;
}
export declare type SubCategoriesOnItem = {
    [key in string]?: string;
} & {
    name?: string;
};
export declare type ItemConfigs = {
    [key in string]?: CategoriesOnItem;
};
export declare type CategoriesOnItem = {
    [key in string]?: string;
} & {
    name?: string;
    subcategories: SubCategoriesOnItem[];
};
/**
 * validators
 */
export declare const DOUBLE_DIGIT_NUMBER_FORMAT_REGEX: RegExp;
declare const generalInformationValidator: any;
declare const updateItemModifiersValidator: any;
declare const updateItemSubcategoriesValidator: any;
declare enum ITEM_EVENT {
    DELETED = "ITEM_DELETED",
    UPDATED = "ITEM_UPDATED",
    MODIFIER_UPDATED = "ITEM_MODIFIER_UPDATED"
}
/**
 * exports
 */
export { Item, CreateUpdateItemInput, CreateItemRequest, UpdateItemRequest, ItemWithKeys, ItemResponse, ItemPatchType, ITEM_EVENT, updateItemSubcategoriesValidator, generalInformationValidator, updateItemModifiersValidator, RelationsOnUpdate, Item86, CreateUpdateItem86, HubOnMenu, };

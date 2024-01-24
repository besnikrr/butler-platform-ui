import { BaseEntity, BaseFilter } from "../base";
interface Subcategory {
    id?: string;
    name: string;
    category: {
        id: string;
        name: string;
    };
}
interface SubcategoryEntity extends BaseEntity {
    id?: string;
    type: string;
    name: string;
    category: {
        id: string;
        name: string;
    };
    categoryId?: string;
}
/**
 *  Action Interfaces
 */
interface CreateSubcategoryInput {
    type?: string;
    name: string;
    categoryId: string;
    category: {
        id: string;
        name: string;
    };
    gs1pk: string;
    gs1sk: string;
}
interface UpdateSubcategoryInput {
    nonce?: string;
    id: string;
    name?: string;
    type?: string;
    category?: {
        id: string;
        name: string;
    };
}
interface SubcategoryRelations {
    items: {
        name: string;
        id: string;
    }[];
    menus: {
        name: string;
        id: string;
    }[];
}
interface ItemRelations {
    items: {
        name: string;
        id: string;
    }[];
    menus: {
        name: string;
        id: string;
    }[];
}
/**
 *  Filter Inputs
 */
interface SubcategoryFilter extends BaseFilter {
    name?: string;
    categories_ids?: string[];
}
/**
 * Event Names
 */
declare enum SUBCATEGORY_EVENT {
    UPDATED = "SUBCATEGORY_UPDATED",
    DELETED = "SUBCATEGORY_DELETED"
}
export { SubcategoryEntity, Subcategory, SubcategoryFilter, CreateSubcategoryInput, UpdateSubcategoryInput, SubcategoryRelations, ItemRelations, SUBCATEGORY_EVENT, };

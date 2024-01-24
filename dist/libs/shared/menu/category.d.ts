import * as yup from "yup";
import { BaseEntity, BaseFilter } from "../base";
interface Category {
    id: string | number;
    name: string;
    start_date?: string;
    end_date?: string;
    parent_category_id?: number | string;
    subcategories?: {
        id: number | string;
        name: string;
    }[];
    parent_category?: {
        id: number | string;
        name: string;
    };
}
interface CategoryEntity extends BaseEntity {
    id: string | number;
    name: string;
    isSubcategory?: boolean;
    start_date?: string;
    end_date?: string;
    parent_category_id?: number | string;
}
interface CategoryFilter extends BaseFilter {
    name: string;
}
declare enum CATEGORY_TYPE {
    CATEGORY = "category",
    SUB_CATEGORY = "subcategory"
}
interface CreateCategoryInput {
    isSubcategory?: boolean;
    name: string;
    start_date?: string;
    end_date?: string;
    categoryId?: string;
}
interface UpdateCategoryInput {
    id: string;
    name?: string;
    start_date?: string;
    end_date?: string;
    isSubcategory?: boolean;
    categoryId?: string;
}
declare enum CATEGORY_EVENT {
    UPDATED = "CATEGORY_UPDATED",
    DELETED = "CATEGORY_DELETED"
}
interface CategoryRelations {
    subcategories: {
        name: string;
        id: string;
    }[];
    items: {
        name: string;
        id: string;
    }[];
    menus: {
        name: string;
        id: string;
    }[];
}
declare const baseCategoryValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    isSubcategory: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    start_date: yup.default<string, import("yup/lib/types").AnyObject, string>;
    end_date: yup.default<string, import("yup/lib/types").AnyObject, string>;
    categoryId: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    isSubcategory: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    start_date: yup.default<string, import("yup/lib/types").AnyObject, string>;
    end_date: yup.default<string, import("yup/lib/types").AnyObject, string>;
    categoryId: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    isSubcategory: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    start_date: yup.default<string, import("yup/lib/types").AnyObject, string>;
    end_date: yup.default<string, import("yup/lib/types").AnyObject, string>;
    categoryId: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>>;
export { Category, CategoryEntity, CreateCategoryInput, UpdateCategoryInput, CategoryFilter, baseCategoryValidator, CategoryRelations, CATEGORY_EVENT, CATEGORY_TYPE };

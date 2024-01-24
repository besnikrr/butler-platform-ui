import * as yup from "yup";
import { BaseEntity, BaseFilter } from "../base";

interface Category {
  id: string | number;
  readonly oms_id?: number;
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

enum CATEGORY_TYPE {
  CATEGORY = "category",
  SUB_CATEGORY = "subcategory",
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

enum CATEGORY_EVENT {
  UPDATED = "CATEGORY_UPDATED",
  DELETED = "CATEGORY_DELETED",
}

interface CategoryRelations {
  subcategories: { name: string; id: string }[];
  items: { name: string; id: string }[];
  menus: { name: string; id: string }[];
}

const baseCategoryValidator = yup
  .object()
  .noUnknown(true)
  .required()
  .shape({
    name: yup.string().trim().required("Category Name is a required field!"),
    isSubcategory: yup.boolean(),
    start_date: yup.string().nullable().optional(),
    end_date: yup.string().nullable().optional(),
    categoryId: yup.string().when("isSubcategory", (isSubcategory) => {
      return isSubcategory
        ? yup.string().required("Category is a required field!")
        : yup.string().nullable();
    }),
  });

export {
  Category,
  CategoryEntity,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryFilter,
  baseCategoryValidator,
  CategoryRelations,
  CATEGORY_EVENT,
  CATEGORY_TYPE,
};

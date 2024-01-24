"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORY_TYPE = exports.CATEGORY_EVENT = exports.baseCategoryValidator = void 0;
const yup = require("yup");
var CATEGORY_TYPE;
(function (CATEGORY_TYPE) {
    CATEGORY_TYPE["CATEGORY"] = "category";
    CATEGORY_TYPE["SUB_CATEGORY"] = "subcategory";
})(CATEGORY_TYPE || (CATEGORY_TYPE = {}));
exports.CATEGORY_TYPE = CATEGORY_TYPE;
var CATEGORY_EVENT;
(function (CATEGORY_EVENT) {
    CATEGORY_EVENT["UPDATED"] = "CATEGORY_UPDATED";
    CATEGORY_EVENT["DELETED"] = "CATEGORY_DELETED";
})(CATEGORY_EVENT || (CATEGORY_EVENT = {}));
exports.CATEGORY_EVENT = CATEGORY_EVENT;
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
exports.baseCategoryValidator = baseCategoryValidator;
//# sourceMappingURL=category.js.map
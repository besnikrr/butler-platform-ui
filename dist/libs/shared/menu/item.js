"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItemModifiersValidator = exports.generalInformationValidator = exports.updateItemSubcategoriesValidator = exports.ITEM_EVENT = exports.ItemPatchType = exports.DOUBLE_DIGIT_NUMBER_FORMAT_REGEX = void 0;
const yup = require("yup");
var ItemPatchType;
(function (ItemPatchType) {
    ItemPatchType["GENERAL_INFORMATION"] = "general-information";
    ItemPatchType["MODIFIERS"] = "modifiers";
    ItemPatchType["CATEGORIES"] = "categories";
})(ItemPatchType || (ItemPatchType = {}));
exports.ItemPatchType = ItemPatchType;
/**
 * validators
 */
exports.DOUBLE_DIGIT_NUMBER_FORMAT_REGEX = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/;
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
        .test("maxDigitsAfterDecimal", `Number field must have 2 digits after decimal or less`, (value) => exports.DOUBLE_DIGIT_NUMBER_FORMAT_REGEX.test(value.toString())),
    image: yup.mixed().when({
        is: (value) => typeof value === "string",
        then: yup.string().required("Image file is a required field!"),
        otherwise: yup
            .mixed()
            .test("name", "Image file is a required field!", (value) => !value || (value && value.name))
            .test("size", "The uploaded file is too big, the maximum supported image size is 4MB.", (value) => !value || (value && value.size <= FILE_SIZE))
            .test("type", "Uploaded file has an unsupported format, the supported image formats are: jpg, jpeg, png", (value) => !value || (value && SUPPORTED_IMG_FORMATS.includes(value.type)))
            .required("Image file is a required field!"),
    }),
    name: yup.string().required("Item Name is a required field!"),
    description: yup.string().trim().max(500).optional().nullable(),
    labels: yup.array().of(yup.string()).optional(),
})
    .required();
exports.generalInformationValidator = generalInformationValidator;
const updateItemModifiersValidator = yup
    .object()
    .shape({
    modifiers: yup
        .array()
        .of(yup.object().shape({
        id: yup.string().required(),
        name: yup.string().required(),
    }))
        .required(),
})
    .required();
exports.updateItemModifiersValidator = updateItemModifiersValidator;
// TODO switch categories
const updateItemSubcategoriesValidator = yup
    .object()
    .shape({
    subcategories: yup.array().of(yup.string()).required(),
})
    .required();
exports.updateItemSubcategoriesValidator = updateItemSubcategoriesValidator;
var ITEM_EVENT;
(function (ITEM_EVENT) {
    ITEM_EVENT["DELETED"] = "ITEM_DELETED";
    ITEM_EVENT["UPDATED"] = "ITEM_UPDATED";
    ITEM_EVENT["MODIFIER_UPDATED"] = "ITEM_MODIFIER_UPDATED";
})(ITEM_EVENT || (ITEM_EVENT = {}));
exports.ITEM_EVENT = ITEM_EVENT;
//# sourceMappingURL=item.js.map
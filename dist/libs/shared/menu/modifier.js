"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODIFIER_EVENT = exports.baseModifierValidator = void 0;
// interfaces
const yup = require("yup");
/**
 * Event Names
 */
var MODIFIER_EVENT;
(function (MODIFIER_EVENT) {
    MODIFIER_EVENT["CREATED"] = "MODIFIER_CREATED";
    MODIFIER_EVENT["UPDATED"] = "MODIFIER_UPDATED";
    MODIFIER_EVENT["DELETED"] = "MODIFIER_DELETED";
})(MODIFIER_EVENT || (MODIFIER_EVENT = {}));
exports.MODIFIER_EVENT = MODIFIER_EVENT;
/**
 *  Validation Schemas
 */
const modifierOptionValidator = yup
    .object()
    .noUnknown(true)
    .required()
    .shape({
    name: yup.string().required("Name of option is a required field!"),
    price: yup
        .number()
        .typeError("Price of option is a required field!")
        .test("maxDigitsAfterDecimal", `Number field must have 2 digits after decimal or less`, (value) => /^\d+(\.\d{1,2})?$/.test(value.toString()))
        .required("Price is a required field!"),
});
const baseModifierValidator = yup
    .object()
    .noUnknown(true)
    .required()
    .shape({
    name: yup.string().required().label("Name"),
    multiselect: yup.boolean().required(),
    options: yup
        .array()
        .required()
        .of(modifierOptionValidator)
        .min(1, "At least one option is required!"),
});
exports.baseModifierValidator = baseModifierValidator;
//# sourceMappingURL=modifier.js.map
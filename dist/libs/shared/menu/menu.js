"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MENU_EVENT = exports.priceMultiplierValidator = exports.MULTIPLY_OPTION = exports.MENU_STATUS = void 0;
const yup = require("yup");
var MENU_STATUS;
(function (MENU_STATUS) {
    MENU_STATUS["ACTIVE"] = "ACTIVE";
    MENU_STATUS["INACTIVE"] = "INACTIVE";
})(MENU_STATUS || (MENU_STATUS = {}));
exports.MENU_STATUS = MENU_STATUS;
var MULTIPLY_OPTION;
(function (MULTIPLY_OPTION) {
    MULTIPLY_OPTION["ADD"] = "ADD";
    MULTIPLY_OPTION["SUBTRACT"] = "SUBTRACT";
    MULTIPLY_OPTION["MULTIPLY"] = "MULTIPLY";
})(MULTIPLY_OPTION || (MULTIPLY_OPTION = {}));
exports.MULTIPLY_OPTION = MULTIPLY_OPTION;
var MENU_EVENT;
(function (MENU_EVENT) {
    MENU_EVENT["UPDATED"] = "MENU_UPDATED";
    MENU_EVENT["DELETED"] = "MENU_DELETED";
})(MENU_EVENT || (MENU_EVENT = {}));
exports.MENU_EVENT = MENU_EVENT;
const priceMultiplierValidator = yup.object().shape({
    action: yup
        .mixed()
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
exports.priceMultiplierValidator = priceMultiplierValidator;
//# sourceMappingURL=menu.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basePermissionGroupValidator = void 0;
const yup = require("yup");
const basePermissionGroupValidator = yup.object().shape({
    name: yup.string().required("Name is a required field!"),
});
exports.basePermissionGroupValidator = basePermissionGroupValidator;
//# sourceMappingURL=permission-group.js.map
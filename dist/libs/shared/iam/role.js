"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseRoleValidator = void 0;
const yup = require("yup");
const baseRoleValidator = yup.object().shape({
    name: yup.string().required("Name is a required field!"),
    description: yup.string().optional(),
    permissiongroups: yup.array().of(yup.number()).optional(),
});
exports.baseRoleValidator = baseRoleValidator;
//# sourceMappingURL=role.js.map
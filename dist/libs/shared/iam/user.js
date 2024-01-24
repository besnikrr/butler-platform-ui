"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseUserValidator = void 0;
const yup = require("yup");
const constants_1 = require("../utils/constants");
const baseUserValidator = yup.object().shape({
    name: yup.string().trim().required("Name is a required field!"),
    email: yup
        .string()
        .matches(constants_1.EMAIL_REGEX, "Only emails are allowed for this field!")
        .required("Email is a required field!"),
    phone_number: yup.string().optional(),
    roles: yup.array().of(yup.number()).optional(),
});
exports.baseUserValidator = baseUserValidator;
//# sourceMappingURL=user.js.map
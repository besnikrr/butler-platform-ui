"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHubValidatorV2 = void 0;
const yup = require("yup");
/*
  Validations schemas
 */
const createHubValidator = yup
    .object()
    .shape({
    city_id: yup.string().required("City is a required field!"),
    name: yup.string().required("Hub name is a required field!"),
    tax_rate: yup
        .number()
        .typeError("Tax rate must be a number")
        .required("Tax is a required field!"),
    contact_phone: yup
        .string()
        .isValidPhoneNumberCheck()
        .typeError("Contact number is not valid!")
        .required("Contact number is required field!"),
    contact_email: yup
        .string()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Only emails are allowed for this field!")
        .required("Contact email is a required field!"),
    address_town: yup.string().required("Address town is a required field!"),
    address_number: yup
        .string()
        .required("Address number is a required field!"),
    address_street: yup
        .string()
        .required("Address street is a required field!"),
    address_zip_code: yup.string().required("Zip code is a required field!"),
    address_coordinates: yup
        .object()
        .optional()
        .shape({
        x: yup
            .number()
            .typeError("Latitude must be a number and is required!")
            .required(),
        y: yup
            .number()
            .typeError("Longitude must be a number and is required!")
            .required(),
    }),
})
    .required();
exports.createHubValidatorV2 = createHubValidator;
//# sourceMappingURL=hub-v2.js.map
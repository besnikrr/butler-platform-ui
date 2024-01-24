"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEntityValidator = exports.coordinatesValidator = exports.addressValidator = exports.primaryContactValidator = void 0;
const yup = require("yup");
const libphonenumber_js_1 = require("libphonenumber-js");
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
function isValidPhoneNumberCheck() {
    return this.test(`test-phonenumber-input`, (value) => {
        if (value && !libphonenumber_js_1.isValidPhoneNumber(value))
            return false;
        return true;
    });
}
yup.addMethod(yup.MixedSchema, "isValidPhoneNumberCheck", isValidPhoneNumberCheck);
const primaryContactValidator = yup.object().shape({
    email: yup
        .string()
        .transform((value) => Array.from(new Set(value.split(","))).join(","))
        .required()
        .test("emails", "Invalid email address", (value) => value && value.split(",").every(isEmail)),
    phone: yup
        .string()
        .isValidPhoneNumberCheck()
        .required()
        .label("Hotel Contact Number"),
});
exports.primaryContactValidator = primaryContactValidator;
const addressValidator = yup.object().shape({
    city: yup.string().optional().label("City"),
    country: yup.string().required().label("Country"),
    line1: yup.string().required().label("Address 1"),
    line2: yup.string(),
    zip_code: yup.string().required().label("Zip code"),
    state: yup.string().required().label("State"),
});
exports.addressValidator = addressValidator;
const coordinatesValidator = yup.object().shape({
    latitude: yup.string(),
    longitude: yup.string(),
});
exports.coordinatesValidator = coordinatesValidator;
const deleteEntityValidator = yup.object().shape({
    id: yup.string(),
});
exports.deleteEntityValidator = deleteEntityValidator;
//# sourceMappingURL=base.js.map
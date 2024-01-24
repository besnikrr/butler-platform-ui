"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHotelValidatorV2 = exports.UpdateMenuConfigs = void 0;
const yup = require("yup");
const constants_1 = require("../utils/constants");
/*
  Validations schemas
 */
const createHotelValidator = yup.object().shape({
    name: yup.string().required("Hotel name is a required field!"),
    formal_name: yup.string().required("Hotel formal name is a required field!"),
    address_town: yup.string().required("Address town is a required field!"),
    address_number: yup.string().required("Address number is a required field!"),
    address_street: yup.string().required("Address street is a required field!"),
    address_zip_code: yup.string().required("Zip code is a required field!"),
    room_count: yup.string().required("Room count is a required field!"),
    room_numbers: yup.array().of(yup.string()).nullable(),
    web_code: yup
        .string()
        .max(3, "Hotel code should contain a maximum of 3 characters")
        .required("Hotel web code is a required field!"),
    code: yup
        .string()
        .max(5, "Hotel code should contain a maximum of 5 characters")
        .required("Hotel code is a required field!"),
    // Contact Information
    account_manager_id: yup
        .string()
        .required("Customer success manager is a required field!"),
    contact_person: yup.string().required("Contact person is a required field!"),
    web_phone: yup
        .string()
        .matches(constants_1.INTL_PHONE_NUMBER_REGEX, "Hotel contact number is not a valid phone number")
        .typeError("Web phone is not valid")
        .required("Web phone is required field!"),
    contact_email: yup
        .string()
        .matches(constants_1.EMAIL_REGEX, "Only emails are allowed for this field!")
        .required("Invoice Email Address(es) is a required field!"),
    web_url_id: yup.string().required("Web URL ID is a required field!"),
    delivery_instructions: yup.string(),
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
    // Hub
    hub_id: yup.string().required("Hub is a required field!"),
    // Edit
    has_pms_enabled: yup.boolean().optional(),
    allow_payment_room_charge: yup.boolean().optional(),
    allow_payment_credit_card: yup.boolean().optional(),
    has_vouchers_enabled: yup.boolean().optional(),
    has_car_service_enabled: yup.boolean().optional(),
    has_activities_enabled: yup.boolean().optional(),
    is_tax_exempt: yup.boolean().optional(),
    active: yup.boolean().optional().default(true),
    web_active: yup.boolean().optional(),
    allow_scheduled_orders: yup.boolean().optional(),
    // Not now
    // reskin_config: yup.string().optional(),
});
exports.createHotelValidatorV2 = createHotelValidator;
const UpdateMenuConfigs = yup.object().shape({
    web_active: yup.boolean().optional(),
    web_url_id: yup.string().required(),
    web_code: yup.string().required(),
    web_phone: yup.string().required(),
    allow_scheduled_orders: yup.boolean().optional(),
    delivery_instructions: yup.string().optional(),
});
exports.UpdateMenuConfigs = UpdateMenuConfigs;
//# sourceMappingURL=hotel-v2.js.map
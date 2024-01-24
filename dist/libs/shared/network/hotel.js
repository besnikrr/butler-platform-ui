"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEEK_DAYS = exports.HOTEL_EVENT = exports.patchPaymentSettingsValidator = exports.authorizedUserValidator = exports.deactivateHubInputValidator = exports.changeHotelStatusInputValidator = exports.patchIntegrationConfigsVouchersAppValidator = exports.patchIntegrationConfigsMenuAppValidator = exports.patchIntegrationConfigsPmsValidator = exports.patchIntegrationConfigsActivitiesValidator = exports.patchIntegrationConfigsShuttleAppValidator = exports.patchHotelValidator = exports.deleteHotelValidator = exports.updateHotelValidator = exports.createHotelValidator = exports.MealPeriod = void 0;
const yup = require("yup");
const base_1 = require("../base");
const authorizedUserValidator = yup.object().shape({
    first_name: yup.string().required().label("First Name"),
    last_name: yup.string().required().label("Last Name"),
    email: yup.string().email().required().label("Email"),
});
exports.authorizedUserValidator = authorizedUserValidator;
const createHotelValidator = yup.object().shape({
    name: yup.string().required().label("Hotel Name"),
    formal_name: yup.string(),
    city_id: yup.string().required().label("City"),
    code: yup
        .string()
        .max(6, "Hotel code should contain a maximum of 6 characters")
        .required()
        .label("Hotel code"),
    active: yup.boolean().optional().default(true),
    is_tax_exempt: yup.boolean().optional().default(false),
    primary_contact: base_1.primaryContactValidator,
    address: base_1.addressValidator,
    hub_id: yup.string().required().label("Hub"),
    account_manager_id: yup.string().required().label("Customer Success Manager"),
    room_numbers: yup.array().of(yup.number()).label("Room Number Count"),
    authorized_users: yup
        .array()
        .of(authorizedUserValidator)
        .optional()
        .label("Authorized users"),
    room_count: yup.string().required().label("Room count"),
});
exports.createHotelValidator = createHotelValidator;
const updateHotelValidator = yup.object({
    id: yup.string(),
    name: yup.string(),
    formal_name: yup.string(),
    code: yup.string().min(3).max(6),
    active: yup.boolean().default(false),
    payment_settings: yup.object({
        allow_credit_card: yup.boolean().default(false),
        allow_room_charge: yup.boolean().default(false),
    }),
    menu_id: yup.string().label("Menu"),
    is_tax_exempt: yup.boolean().default(false),
    primary_contact: base_1.primaryContactValidator,
    address: base_1.addressValidator,
    hub_id: yup.string(),
    allow_scheduled_orders: yup.boolean().default(false),
    account_manager_id: yup.string(),
    account_manager: yup
        .object({ id: yup.string(), name: yup.string() })
        .optional(),
    integration_configs: yup.object({
        pms: yup.object({
            enabled: yup.boolean(),
        }),
        activities_app: yup.object({
            enabled: yup.boolean(),
        }),
        shuttle_app: yup.object({
            enabled: yup.boolean(),
        }),
    }),
    delivery_instructions: yup.string(),
    room_numbers: yup.array().of(yup.number()).label("Room number"),
    authorized_users: yup
        .array()
        .of(authorizedUserValidator)
        .optional()
        .label("Authorized users"),
    created_at: yup.number().optional(),
    updated_at: yup.number().optional(),
});
exports.updateHotelValidator = updateHotelValidator;
const patchIntegrationConfigsShuttleAppValidator = yup.object({
    enabled: yup.boolean(),
});
exports.patchIntegrationConfigsShuttleAppValidator = patchIntegrationConfigsShuttleAppValidator;
const patchIntegrationConfigsVouchersAppValidator = yup.object({
    enabled: yup.boolean(),
    authorized_users: yup
        .array()
        .of(authorizedUserValidator)
        .optional()
        .label("Authorized users"),
});
exports.patchIntegrationConfigsVouchersAppValidator = patchIntegrationConfigsVouchersAppValidator;
const patchIntegrationConfigsPmsValidator = yup.object({
    enabled: yup.boolean(),
});
exports.patchIntegrationConfigsPmsValidator = patchIntegrationConfigsPmsValidator;
const patchIntegrationConfigsActivitiesValidator = yup.object({
    enabled: yup.boolean(),
});
exports.patchIntegrationConfigsActivitiesValidator = patchIntegrationConfigsActivitiesValidator;
const patchPaymentSettingsValidator = yup.object({
    allow_credit_card: yup.boolean().default(false),
    allow_room_charge: yup.boolean().default(false),
});
exports.patchPaymentSettingsValidator = patchPaymentSettingsValidator;
const changeHotelStatusInputValidator = yup.object({
    active: yup.boolean().required(),
});
exports.changeHotelStatusInputValidator = changeHotelStatusInputValidator;
const patchIntegrationConfigsMenuAppValidator = yup.object({
    web_id: yup.string().required().label("Web Id"),
    web_code: yup.string().required().label("Web Code"),
    web_phone: yup.string().required().label("Web Phone"),
    allow_scheduled_orders: yup
        .boolean()
        .required()
        .label("Allow Scheduled Orders"),
    delivery_instructions: yup.string().label("Delivery Instructions"),
});
exports.patchIntegrationConfigsMenuAppValidator = patchIntegrationConfigsMenuAppValidator;
const patchHotelValidator = yup.object({
    name: yup.string().optional(),
    formal_name: yup.string().optional(),
    code: yup.string().optional(),
    active: yup.boolean().default(false).optional(),
    payment_settings: yup
        .object({
        allow_credit_card: yup.boolean().default(false),
        allow_room_charge: yup.boolean().default(false),
    })
        .optional(),
    is_tax_exempt: yup.boolean().default(false).optional(),
    primary_contact: base_1.primaryContactValidator.optional().default(undefined),
    address: base_1.addressValidator.optional().default(undefined),
    hub_id: yup.string().optional(),
    city_id: yup.string().optional(),
    allow_scheduled_orders: yup.boolean().default(false).optional(),
    account_manager_id: yup.string().optional(),
    account_manager: yup
        .object({ id: yup.string(), name: yup.string() })
        .optional(),
    integration_configs: yup
        .object({
        pms: yup.object({
            enabled: yup.boolean(),
        }),
        activities_app: yup.object({
            enabled: yup.boolean(),
        }),
        shuttle_app: yup.object({
            enabled: yup.boolean(),
        }),
    })
        .optional()
        .default(undefined),
    delivery_instructions: yup.string().optional(),
    room_numbers: yup.array().of(yup.number()).optional(),
    authorized_users: yup
        .array()
        .of(authorizedUserValidator)
        .optional()
        .label("Authorized users"),
    created_at: yup.number().optional(),
    updated_at: yup.number().optional(),
});
exports.patchHotelValidator = patchHotelValidator;
const reassignHubs = yup.object().shape({
    hotel_id: yup.string().required(),
    hub_id: yup.string().required(),
    hub_name: yup.string().required(),
});
const deactivateHubInputValidator = yup.object().shape({
    hub_id: yup.string().required(),
    data: yup.array().of(reassignHubs).required(),
});
exports.deactivateHubInputValidator = deactivateHubInputValidator;
const deleteHotelValidator = base_1.deleteEntityValidator;
exports.deleteHotelValidator = deleteHotelValidator;
var MealPeriod;
(function (MealPeriod) {
    MealPeriod["Breakfast"] = "Breakfast";
    MealPeriod["LunchDinner"] = "LunchDinner";
    MealPeriod["Convenience"] = "Convenience";
})(MealPeriod = exports.MealPeriod || (exports.MealPeriod = {}));
var WEEK_DAYS;
(function (WEEK_DAYS) {
    WEEK_DAYS["MONDAY"] = "Monday";
    WEEK_DAYS["TUESDAY"] = "Tuesday";
    WEEK_DAYS["WEDNESDAY"] = "Wednesday";
    WEEK_DAYS["THURSDAY"] = "Thursday";
    WEEK_DAYS["FRIDAY"] = "Friday";
    WEEK_DAYS["SATURDAY"] = "Saturday";
    WEEK_DAYS["SUNDAY"] = "Sunday";
})(WEEK_DAYS || (WEEK_DAYS = {}));
exports.WEEK_DAYS = WEEK_DAYS;
/**
 * Event Names
 */
var HOTEL_EVENT;
(function (HOTEL_EVENT) {
    HOTEL_EVENT["CREATED"] = "HOTEL_CREATED";
    HOTEL_EVENT["UPDATED"] = "HOTEL_UPDATED";
    HOTEL_EVENT["OMS_CREATED"] = "OMS_HOTEL_CREATED";
    HOTEL_EVENT["OMS_UPDATED"] = "OMS_HOTEL_UPDATED";
    HOTEL_EVENT["DELETED"] = "HOTEL_DELETED";
    HOTEL_EVENT["UPDATED_INTEGRATION_CONFIGS_SHUTTLE_APP"] = "UPDATED_INTEGRATION_CONFIGS_SHUTTLE_APP";
    HOTEL_EVENT["UPDATED_INTEGRATION_CONFIGS_PMS"] = "UPDATED_INTEGRATION_CONFIGS_PMS";
    HOTEL_EVENT["UPDATED_INTEGRATION_CONFIGS_ACTIVITIES_APP"] = "UPDATED_INTEGRATION_CONFIGS_ACTIVITIES_APP";
    HOTEL_EVENT["UPDATED_INTEGRATION_CONFIGS_MENU_APP"] = "UPDATED_INTEGRATION_CONFIGS_MENU_APP";
    HOTEL_EVENT["UPDATED_INTEGRATION_CONFIGS_VOUCHERS_APP"] = "UPDATED_INTEGRATION_CONFIGS_VOUCHERS_APP";
    HOTEL_EVENT["UPDATED_PAYMENT_SETTINGS"] = "UPDATED_PAYMENT_SETTINGS";
    HOTEL_EVENT["STATUS_CHANGED"] = "HOTEL_STATUS_CHANGED";
    HOTEL_EVENT["MENU_ASSIGNED"] = "HOTEL_MENU_ASSIGNED";
})(HOTEL_EVENT || (HOTEL_EVENT = {}));
exports.HOTEL_EVENT = HOTEL_EVENT;
//# sourceMappingURL=hotel.js.map
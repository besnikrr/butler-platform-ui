"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HUB_EVENT = exports.patchHubValidator = exports.deleteHubValidator = exports.updateHubValidator = exports.createHubValidator = void 0;
const yup = require("yup");
const base_1 = require("../base");
const city_1 = require("./city");
const createHubValidator = yup
    .object()
    .shape({
    name: yup.string().required().label("Hub name"),
    primary_contact: base_1.primaryContactValidator.required(),
    address: base_1.addressValidator.required(),
    city_id: yup.string().required(),
    active: yup.boolean().required(),
    tax: yup.object().shape({ percentage: yup.number().required() }).required(),
    coordinates: base_1.coordinatesValidator.optional(),
    integration_configs: yup.object().shape({
        quick_books: yup
            .object({
            class: yup.string(),
        })
            .optional(),
        expeditor_app: yup.object().shape({
            enabled: yup.boolean(),
        }),
        next_move_app: yup.object().shape({
            enabled: yup.boolean(),
        }),
    }),
})
    .required();
exports.createHubValidator = createHubValidator;
const patchHubValidator = yup.object().shape({
    name: yup.string().optional(),
    city_id: yup.string().optional(),
    city: city_1.updateCityValidator.optional().default(undefined),
    address: base_1.addressValidator.optional().default(undefined),
    primary_contact: base_1.primaryContactValidator.optional().default(undefined),
    active: yup.boolean().optional(),
    tax: yup
        .object()
        .shape({
        percentage: yup.number(),
    })
        .optional()
        .default(undefined),
    coordinates: base_1.coordinatesValidator.optional().default(undefined),
    integration_configs: yup
        .object()
        .shape({
        quick_books: yup
            .object()
            .shape({
            class: yup.string(),
        })
            .optional(),
        expeditor_app: yup.object().shape({
            enabled: yup.boolean(),
        }),
        next_move_app: yup.object().shape({
            enabled: yup.boolean(),
        }),
    })
        .optional()
        .default(undefined),
});
exports.patchHubValidator = patchHubValidator;
const updateHubValidator = yup.object().shape({
    name: yup.string().required().label("Hub Name"),
    city_id: yup.string(),
    address: base_1.addressValidator,
    primary_contact: base_1.primaryContactValidator,
    active: yup.boolean(),
    tax: yup.object().shape({ percentage: yup.number() }),
    coordinates: base_1.coordinatesValidator,
    integration_configs: yup.object().shape({
        quick_books: yup
            .object()
            .shape({
            class: yup.string(),
        })
            .optional(),
        expeditor_app: yup.object().shape({
            enabled: yup.boolean(),
        }),
        next_move_app: yup.object().shape({
            enabled: yup.boolean(),
        }),
    }),
});
exports.updateHubValidator = updateHubValidator;
const deleteHubValidator = base_1.deleteEntityValidator;
exports.deleteHubValidator = deleteHubValidator;
var HUB_EVENT;
(function (HUB_EVENT) {
    HUB_EVENT["CREATED"] = "HUB_CREATED";
    HUB_EVENT["UPDATED"] = "HUB_UPDATED";
    HUB_EVENT["OMS_CREATED"] = "OMS_CREATED";
    HUB_EVENT["OMS_UPDATED"] = "OMS_UPDATED";
    HUB_EVENT["DELETED"] = "HUB_DELETED";
    HUB_EVENT["DEACTIVATED"] = "HUB_DEACTIVATED";
})(HUB_EVENT || (HUB_EVENT = {}));
exports.HUB_EVENT = HUB_EVENT;
//# sourceMappingURL=hub.js.map
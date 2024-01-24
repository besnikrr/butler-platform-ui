"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CITY_EVENT = exports.deleteCityValidator = exports.updateCityValidator = exports.createCityValidator = exports.patchCityValidator = void 0;
const yup = require("yup");
const base_1 = require("../base");
/**
 *  Validation Schemas
 */
const createCityValidator = yup.object().shape({
    name: yup.string().required(),
    time_zone: yup.string().required(),
    state: yup.string().required(),
    country: yup.string().required(),
});
exports.createCityValidator = createCityValidator;
const updateCityValidator = yup.object().shape({
    name: yup.string().optional(),
    time_zone: yup.string().optional(),
    state: yup.string().optional(),
    country: yup.string().optional(),
});
exports.updateCityValidator = updateCityValidator;
const patchCityValidator = yup.object().shape({
    name: yup.string().optional(),
    time_zone: yup.string().optional(),
    state: yup.string().optional(),
    country: yup.string().optional(),
});
exports.patchCityValidator = patchCityValidator;
const deleteCityValidator = base_1.deleteEntityValidator;
exports.deleteCityValidator = deleteCityValidator;
/**
 * Event Names
 */
var CITY_EVENT;
(function (CITY_EVENT) {
    CITY_EVENT["CREATED"] = "CITY_CREATED";
    CITY_EVENT["UPDATED"] = "CITY_UPDATED";
    CITY_EVENT["DELETED"] = "CITY_DELETED";
})(CITY_EVENT || (CITY_EVENT = {}));
exports.CITY_EVENT = CITY_EVENT;
//# sourceMappingURL=city.js.map
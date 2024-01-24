"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCityValidatorV2 = void 0;
const yup = require("yup");
/**
 *  Validation Schemas
 */
const createCityValidator = yup
    .object()
    .noUnknown(true)
    .required()
    .shape({
    name: yup.string().required("Name is a required field!"),
    time_zone: yup.string().required("Time zone is a required field!"),
    state: yup.string().optional(),
});
exports.createCityValidatorV2 = createCityValidator;
//# sourceMappingURL=city-v2.js.map
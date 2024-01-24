import * as yup from "yup";
import { BaseEntity, DeleteEntityInput, BaseFilter } from "../base";
/**
 *  Main Entity
 */
interface City extends BaseEntity {
    id?: string;
    name: string;
    time_zone: string;
    state: string;
    country: string;
    aggregates: {
        count_hubs: number;
        count_hotels: number;
    };
}
/**
 *  Action Interfaces
 */
interface CreateCityInput {
    name: string;
    time_zone: string;
    state: string;
    country: string;
}
interface PutCityInput {
    pk: string;
    sk: string;
    name: string;
    time_zone: string;
    state: string;
    country: string;
}
interface PatchCityInput {
    name?: string;
    time_zone?: string;
    state?: string;
    country?: string;
}
declare type DeleteCityInput = DeleteEntityInput;
interface UpdateCityInput {
    name?: string;
    time_zone?: string;
    state?: string;
    country?: string;
}
/**
 *  Validation Schemas
 */
declare const createCityValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    time_zone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    time_zone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    time_zone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>>;
declare const updateCityValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    time_zone: yup.default<string, import("yup/lib/types").AnyObject, string>;
    state: yup.default<string, import("yup/lib/types").AnyObject, string>;
    country: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    time_zone: yup.default<string, import("yup/lib/types").AnyObject, string>;
    state: yup.default<string, import("yup/lib/types").AnyObject, string>;
    country: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    time_zone: yup.default<string, import("yup/lib/types").AnyObject, string>;
    state: yup.default<string, import("yup/lib/types").AnyObject, string>;
    country: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>>;
declare const patchCityValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    time_zone: yup.default<string, import("yup/lib/types").AnyObject, string>;
    state: yup.default<string, import("yup/lib/types").AnyObject, string>;
    country: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    time_zone: yup.default<string, import("yup/lib/types").AnyObject, string>;
    state: yup.default<string, import("yup/lib/types").AnyObject, string>;
    country: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    time_zone: yup.default<string, import("yup/lib/types").AnyObject, string>;
    state: yup.default<string, import("yup/lib/types").AnyObject, string>;
    country: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>>;
declare const deleteCityValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>>;
/**
 *  Filter Inputs
 */
interface CityFilter extends BaseFilter {
    names?: string[];
    name?: string;
}
/**
 * Event Names
 */
declare enum CITY_EVENT {
    CREATED = "CITY_CREATED",
    UPDATED = "CITY_UPDATED",
    DELETED = "CITY_DELETED"
}
export { City, CreateCityInput, PutCityInput, PatchCityInput, patchCityValidator, DeleteCityInput, UpdateCityInput, createCityValidator, updateCityValidator, deleteCityValidator, CityFilter, CITY_EVENT, };

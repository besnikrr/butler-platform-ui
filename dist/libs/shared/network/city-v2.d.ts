import * as yup from "yup";
import { BaseEntityV2 } from "./base";
import { HubV2 } from "./hub-v2";
interface City extends BaseEntityV2 {
    readonly id: number;
    readonly oms_id?: number;
    name: string;
    state?: string;
    time_zone: string;
}
declare type CityList = City & {
    hubs: HubV2[];
};
declare type CreateCity = Omit<City, "id" | "created_at" | "updated_at" | "deleted_at">;
/**
 *  Validation Schemas
 */
declare const createCityValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    time_zone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    state: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    time_zone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    state: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    time_zone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    state: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>>;
export { City as CityV2, CreateCity, CityList, createCityValidator as createCityValidatorV2, };

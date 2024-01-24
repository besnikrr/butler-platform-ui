import * as yup from "yup";
import { BaseEntity } from "../base";
interface User extends BaseEntity {
    readonly id?: string;
    email: string;
    name: string;
    phone_number?: string;
    roles: number[];
}
declare const baseUserValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    phone_number: yup.default<string, import("yup/lib/types").AnyObject, string>;
    roles: any;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    phone_number: yup.default<string, import("yup/lib/types").AnyObject, string>;
    roles: any;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    phone_number: yup.default<string, import("yup/lib/types").AnyObject, string>;
    roles: any;
}>>>;
export { User, baseUserValidator };

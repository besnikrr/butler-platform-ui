import * as yup from "yup";
import { BaseEntity } from "../base";
interface PermissionGroup {
    readonly id?: string;
    name: string;
    permissions?: string[] | number[];
}
interface Role extends BaseEntity {
    readonly id?: string;
    name: string;
    description: string;
    permissiongroups: PermissionGroup[];
}
declare const baseRoleValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    description: yup.default<string, import("yup/lib/types").AnyObject, string>;
    permissiongroups: any;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    description: yup.default<string, import("yup/lib/types").AnyObject, string>;
    permissiongroups: any;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    description: yup.default<string, import("yup/lib/types").AnyObject, string>;
    permissiongroups: any;
}>>>;
export { Role, PermissionGroup, baseRoleValidator };

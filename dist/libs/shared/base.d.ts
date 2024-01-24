import * as yup from "yup";
import { AxiosInstance } from "axios";
declare module "yup" {
    interface StringSchema {
        isValidPhoneNumberCheck(this: any): StringSchema;
    }
}
interface PrimaryContact {
    name: string;
    phone: string;
    email: string;
}
declare const primaryContactValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>>;
interface BaseEntity {
    pk?: string;
    sk?: string;
    gs1pk?: string;
    gs1sk?: string;
    gs2pk?: string;
    gs2sk?: string;
    gs3pk?: string;
    gs3sk?: string;
    gs4pk?: string;
    gs4sk?: string;
    oms_pk?: string;
    oms_sk?: string;
    created_at?: number;
    created_by_id?: string;
    created_by?: AuthorizedUser;
    updated_at?: number;
    updated_by_id?: string;
    updated_by?: AuthorizedUser;
    deleted_at?: number;
    deleted_by_id?: string;
    deleted_by?: AuthorizedUser;
}
interface Address {
    city: string;
    country: string;
    line1: string;
    line2: string;
    zip_code: number;
    state: string;
}
declare const addressValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    city: yup.default<string, import("yup/lib/types").AnyObject, string>;
    country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    line1: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    line2: yup.default<string, import("yup/lib/types").AnyObject, string>;
    zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    city: yup.default<string, import("yup/lib/types").AnyObject, string>;
    country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    line1: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    line2: yup.default<string, import("yup/lib/types").AnyObject, string>;
    zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    city: yup.default<string, import("yup/lib/types").AnyObject, string>;
    country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    line1: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    line2: yup.default<string, import("yup/lib/types").AnyObject, string>;
    zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>>;
interface Coordinates {
    latitude: number;
    longitude: number;
}
declare const coordinatesValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    latitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
    longitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    latitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
    longitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    latitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
    longitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>>;
interface DeleteEntityInput {
    id: string;
}
declare const deleteEntityValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>>;
interface Tenant {
    id: string;
    name: string;
}
/**
 * TODO
 */
interface AuthorizedUser {
    id: string;
    email: string;
    roles: string[];
    displayName: string;
    permissions: any[];
    hotel_id?: string;
}
interface ActionContext {
    tenant: Tenant;
    authorizedUser: AuthorizedUser;
}
interface BaseFilter {
    limit?: number;
    lastEvaluatedKey?: string;
    back?: boolean;
}
export interface ResourceResponse<T> {
    result?: T;
    totalItems?: number;
    totalPages?: number;
    lastEvaluatedKey?: string;
    limit?: number;
    error?: ResourceErrorResponse;
    message?: string;
    status?: number;
}
export interface HTTPResourceResponse<T> {
    payload?: T;
    total?: number;
    nextPage?: number;
    errors?: any[];
}
export interface ResourceErrorResponse {
    message: string | string[];
    code: string | number;
    displayMessage?: string;
}
interface QueryListProps {
    page?: number;
    search?: string;
    filters?: string;
    enabled?: boolean;
    service?: AxiosInstance;
}
declare type QueryListByIdProps = QueryListProps & {
    id: number;
};
interface QueryDetailsProps {
    id: number | string;
    enabled?: boolean;
}
export { PrimaryContact, BaseEntity, Address, Coordinates, DeleteEntityInput, primaryContactValidator, addressValidator, coordinatesValidator, deleteEntityValidator, ActionContext, BaseFilter, AuthorizedUser, QueryListProps, QueryDetailsProps, QueryListByIdProps, };

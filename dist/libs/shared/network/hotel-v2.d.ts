import * as yup from "yup";
import { BaseEntityV2, Coordinate } from "./base";
import type { HubV2 } from "./hub-v2";
interface Hotel extends BaseEntityV2 {
    readonly id: number;
    readonly oms_id?: number;
    hub_id?: string | number;
    name: string;
    formal_name: string;
    is_tax_exempt: boolean;
    active: boolean;
    address_town: string;
    address_street: string;
    address_number: string;
    address_zip_code: string;
    address_coordinates: Coordinate;
    web_active?: boolean;
    web_phone: string;
    web_url_id: string;
    web_code: string;
    code: string;
    contact_person: string;
    contact_email: string;
    account_manager_id: number;
    room_count: number;
    room_numbers?: string[];
    delivery_instructions: string;
    reskin_config: string;
    allow_payment_room_charge: boolean;
    allow_payment_credit_card: boolean;
    allow_scheduled_orders: boolean;
    has_vouchers_enabled: boolean;
    has_pms_enabled: boolean;
    has_car_service_enabled: boolean;
    has_activities_enabled: boolean;
    operating_hours?: OperatingWeekDays;
}
interface OperatingWeekDays {
    [key: string]: any;
}
declare type HotelList = Hotel & {
    hub: HubV2;
};
declare type HotelDetails = Hotel & {
    hub?: HubV2;
};
declare type CreateHotel = Omit<Hotel & {
    address_coordinates: string;
    room_numbers?: string;
}, "id" | "created_at" | "updated_at" | "deleted_at" | "room_numbers">;
declare type UpdateHotel = Omit<Partial<Hotel> & {
    address_coordinates?: string;
    room_numbers?: string;
    hub?: HubV2;
}, "id" | "created_at" | "updated_at" | "deleted_at" | "room_numbers">;
declare const createHotelValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    formal_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    address_town: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    address_number: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    address_street: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    address_zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    room_count: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    room_numbers: yup.ArraySchema<yup.default<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    web_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    account_manager_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    contact_person: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    contact_email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_url_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    delivery_instructions: yup.default<string, import("yup/lib/types").AnyObject, string>;
    address_coordinates: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        x: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        y: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        x: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        y: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        x: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        y: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>>;
    hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    has_pms_enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    allow_payment_room_charge: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    allow_payment_credit_card: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    has_vouchers_enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    has_car_service_enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    has_activities_enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    is_tax_exempt: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    web_active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    allow_scheduled_orders: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    formal_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    address_town: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    address_number: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    address_street: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    address_zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    room_count: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    room_numbers: yup.ArraySchema<yup.default<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    web_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    account_manager_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    contact_person: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    contact_email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_url_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    delivery_instructions: yup.default<string, import("yup/lib/types").AnyObject, string>;
    address_coordinates: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        x: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        y: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        x: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        y: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        x: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        y: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>>;
    hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    has_pms_enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    allow_payment_room_charge: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    allow_payment_credit_card: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    has_vouchers_enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    has_car_service_enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    has_activities_enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    is_tax_exempt: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    web_active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    allow_scheduled_orders: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    formal_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    address_town: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    address_number: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    address_street: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    address_zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    room_count: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    room_numbers: yup.ArraySchema<yup.default<string, import("yup/lib/types").AnyObject, string>, import("yup/lib/types").AnyObject, string[], string[]>;
    web_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    account_manager_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    contact_person: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    contact_email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_url_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    delivery_instructions: yup.default<string, import("yup/lib/types").AnyObject, string>;
    address_coordinates: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        x: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        y: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        x: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        y: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        x: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        y: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>>;
    hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    has_pms_enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    allow_payment_room_charge: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    allow_payment_credit_card: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    has_vouchers_enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    has_car_service_enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    has_activities_enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    is_tax_exempt: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    web_active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    allow_scheduled_orders: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>>;
declare const UpdateMenuConfigs: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    web_active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    web_url_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    allow_scheduled_orders: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    delivery_instructions: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    web_active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    web_url_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    allow_scheduled_orders: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    delivery_instructions: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    web_active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    web_url_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    allow_scheduled_orders: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    delivery_instructions: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>>;
export { Hotel as HotelV2, CreateHotel, UpdateHotel, HotelList, HotelDetails, UpdateMenuConfigs, createHotelValidator as createHotelValidatorV2, };

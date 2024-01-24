import * as yup from "yup";
import { Hub, ReferenceEntity } from "./hub";
import { PrimaryContact, BaseFilter, Address, BaseEntity, Coordinates, DeleteEntityInput } from "../base";
interface IntegrationConfigs {
    menu_app: {
        web_id: string;
        web_code: string;
        web_phone: string;
        allow_scheduled_orders: boolean;
        delivery_instructions?: string;
        operating_hours?: OperatingWeekDays;
    };
    activities_app: {
        enabled: boolean;
    };
    shuttle_app: {
        enabled: boolean;
    };
    vouchers_app: {
        enabled: boolean;
        authorized_users: AuthorizedUserHOAM[];
    };
    pms: {
        enabled: boolean;
    };
}
export interface AuthorizedUserHOAM {
    first_name: string;
    last_name: string;
    email: string;
}
interface Hotel extends BaseEntity {
    id?: string;
    oms_menu_id: number;
    name: string;
    formal_name: string;
    code: string;
    active: boolean;
    integration_configs: IntegrationConfigs;
    payment_settings: {
        allow_credit_card: boolean;
        allow_room_charge: boolean;
    };
    is_tax_exempt: boolean;
    primary_contact?: PrimaryContact;
    address: Address;
    coordinates: Coordinates;
    hub_id: string;
    hub: ReferenceEntity;
    city_id: string;
    city: ReferenceEntity;
    account_manager_id: string;
    account_manager: {
        id: string;
        name: string;
    };
    room_numbers?: string[];
    room_count?: number;
    reskin_config?: string;
    menu_id?: string;
    menu: {
        id: string;
        name: string;
    };
}
interface CreateHotelInput {
    id?: string;
    name: string;
    formal_name: string;
    code: string;
    active: boolean;
    payment_settings: {
        allow_credit_card: boolean;
        allow_room_charge: boolean;
    };
    is_tax_exempt: boolean;
    primary_contact: PrimaryContact;
    address: Address;
    hub_id: string;
    hub: ReferenceEntity;
    city_id: string;
    coordinates: Coordinates;
    account_manager_id: string;
    account_manager: ReferenceEntity;
    room_count?: number;
    room_numbers: string;
    contact_number: string;
    invoice_email_address: string;
    integration_configs?: IntegrationConfigs;
}
declare const authorizedUserValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    first_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    last_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    first_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    last_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    first_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    last_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>>;
declare const createHotelValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    formal_name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    city_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    is_tax_exempt: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    primary_contact: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>;
    address: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
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
    hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    account_manager_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    room_numbers: yup.ArraySchema<yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>, import("yup/lib/types").AnyObject, number[], number[]>;
    authorized_users: any;
    room_count: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    formal_name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    city_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    is_tax_exempt: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    primary_contact: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>;
    address: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
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
    hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    account_manager_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    room_numbers: yup.ArraySchema<yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>, import("yup/lib/types").AnyObject, number[], number[]>;
    authorized_users: any;
    room_count: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    formal_name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    city_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    is_tax_exempt: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    primary_contact: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>;
    address: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
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
    hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    account_manager_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    room_numbers: yup.ArraySchema<yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>, import("yup/lib/types").AnyObject, number[], number[]>;
    authorized_users: any;
    room_count: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
}>>>;
interface UpdateHotelInput {
    id: string;
    name: string;
    formal_name: string;
    code: string;
    active: boolean;
    payment_settings: {
        allow_credit_card: boolean;
        allow_room_charge: boolean;
    };
    is_tax_exempt: boolean;
    primary_contact: PrimaryContact;
    address: Address;
    hub_id: string;
    hub: Hub;
    city_id?: string;
    city?: ReferenceEntity;
    allow_scheduled_orders: boolean;
    account_manager_id: string;
    account_manager: {
        id: string;
        name: string;
    };
    integration_configs: IntegrationConfigs;
    delivery_instructions: string;
    menu_id: string;
    room_count: number;
    room_numbers?: string[];
    coordinates: Coordinates;
    authorized_users?: AuthorizedUserHOAM[];
}
declare const updateHotelValidator: import("yup/lib/object").OptionalObjectSchema<{
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    formal_name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    code: yup.default<string, import("yup/lib/types").AnyObject, string>;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    payment_settings: import("yup/lib/object").OptionalObjectSchema<{
        allow_credit_card: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        allow_room_charge: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        allow_credit_card: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        allow_room_charge: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    }>>;
    menu_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    is_tax_exempt: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    primary_contact: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>;
    address: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
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
    hub_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    allow_scheduled_orders: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    account_manager_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    account_manager: import("yup/lib/object").OptionalObjectSchema<{
        id: yup.default<string, import("yup/lib/types").AnyObject, string>;
        name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        id: yup.default<string, import("yup/lib/types").AnyObject, string>;
        name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }>>;
    integration_configs: import("yup/lib/object").OptionalObjectSchema<{
        pms: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        activities_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        shuttle_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        pms: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        activities_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        shuttle_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
    }>>;
    delivery_instructions: yup.default<string, import("yup/lib/types").AnyObject, string>;
    room_numbers: yup.ArraySchema<yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>, import("yup/lib/types").AnyObject, number[], number[]>;
    authorized_users: any;
    created_at: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    updated_at: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    formal_name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    code: yup.default<string, import("yup/lib/types").AnyObject, string>;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    payment_settings: import("yup/lib/object").OptionalObjectSchema<{
        allow_credit_card: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        allow_room_charge: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        allow_credit_card: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        allow_room_charge: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    }>>;
    menu_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    is_tax_exempt: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    primary_contact: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>;
    address: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
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
    hub_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    allow_scheduled_orders: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    account_manager_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    account_manager: import("yup/lib/object").OptionalObjectSchema<{
        id: yup.default<string, import("yup/lib/types").AnyObject, string>;
        name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        id: yup.default<string, import("yup/lib/types").AnyObject, string>;
        name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }>>;
    integration_configs: import("yup/lib/object").OptionalObjectSchema<{
        pms: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        activities_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        shuttle_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        pms: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        activities_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        shuttle_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
    }>>;
    delivery_instructions: yup.default<string, import("yup/lib/types").AnyObject, string>;
    room_numbers: yup.ArraySchema<yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>, import("yup/lib/types").AnyObject, number[], number[]>;
    authorized_users: any;
    created_at: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    updated_at: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>>;
interface PatchHotelInput {
    name?: string;
    formal_name?: string;
    code?: string;
    active?: boolean;
    payment_settings?: {
        allow_credit_card?: boolean;
        allow_room_charge?: boolean;
    };
    is_tax_exempt?: boolean;
    primary_contact?: PrimaryContact;
    address?: Address;
    hub_id?: string;
    hub?: ReferenceEntity;
    city_id?: string;
    city?: ReferenceEntity;
    allow_scheduled_orders?: boolean;
    account_manager_id?: string;
    account_manager?: ReferenceEntity;
    integration_configs?: {
        pms?: {
            enabled?: boolean;
        };
        activities_app?: {
            enabled?: boolean;
        };
        shuttle_app?: {
            enabled?: boolean;
        };
    };
    delivery_instructions?: string;
    menu_id?: string;
    room_count?: string;
    room_numbers?: string;
    contact_number?: string;
    invoice_email_address?: string;
    coordinates?: Coordinates;
    car_service?: boolean;
    voucher_config?: boolean;
    authorized_users?: AuthorizedUserHOAM[];
}
interface PatchHotelIntegrationConfigsShuttleAppInput {
    enabled: boolean;
}
interface PatchHotelPaymentSettingsInput {
    allow_credit_card?: boolean;
    allow_room_charge?: boolean;
}
interface PatchHotelIntegrationConfigsVouchersAppInput {
    enabled: boolean;
    authorized_users?: AuthorizedUserHOAM[];
}
interface PatchHotelIntegrationConfigsPmsInput {
    enabled: boolean;
}
interface PatchHotelIntegrationConfigsActivitiesAppInput {
    enabled: boolean;
}
interface ChangeHotelStatusInput {
    active: boolean;
}
interface PatchHotelIntegrationConfigsMenuAppInput {
    web_id?: string;
    web_code?: string;
    web_phone?: string;
    allow_scheduled_orders?: boolean;
    delivery_instructions?: string;
    integration_configs?: IntegrationConfigs;
}
declare const patchIntegrationConfigsShuttleAppValidator: import("yup/lib/object").OptionalObjectSchema<{
    enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>;
declare const patchIntegrationConfigsVouchersAppValidator: import("yup/lib/object").OptionalObjectSchema<{
    enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    authorized_users: any;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    authorized_users: any;
}>>;
declare const patchIntegrationConfigsPmsValidator: import("yup/lib/object").OptionalObjectSchema<{
    enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>;
declare const patchIntegrationConfigsActivitiesValidator: import("yup/lib/object").OptionalObjectSchema<{
    enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>;
declare const patchPaymentSettingsValidator: import("yup/lib/object").OptionalObjectSchema<{
    allow_credit_card: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    allow_room_charge: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    allow_credit_card: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    allow_room_charge: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>;
declare const changeHotelStatusInputValidator: import("yup/lib/object").OptionalObjectSchema<{
    active: import("yup/lib/boolean").RequiredBooleanSchema<boolean, import("yup/lib/types").AnyObject>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    active: import("yup/lib/boolean").RequiredBooleanSchema<boolean, import("yup/lib/types").AnyObject>;
}>>;
declare const patchIntegrationConfigsMenuAppValidator: import("yup/lib/object").OptionalObjectSchema<{
    web_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    allow_scheduled_orders: import("yup/lib/boolean").RequiredBooleanSchema<boolean, import("yup/lib/types").AnyObject>;
    delivery_instructions: yup.default<string, import("yup/lib/types").AnyObject, string>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    web_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    web_phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    allow_scheduled_orders: import("yup/lib/boolean").RequiredBooleanSchema<boolean, import("yup/lib/types").AnyObject>;
    delivery_instructions: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>;
declare const patchHotelValidator: import("yup/lib/object").OptionalObjectSchema<{
    name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    formal_name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    code: yup.default<string, import("yup/lib/types").AnyObject, string>;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    payment_settings: import("yup/lib/object").OptionalObjectSchema<{
        allow_credit_card: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        allow_room_charge: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        allow_credit_card: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        allow_room_charge: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    }>>;
    is_tax_exempt: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    primary_contact: any;
    address: any;
    hub_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    city_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    allow_scheduled_orders: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    account_manager_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    account_manager: import("yup/lib/object").OptionalObjectSchema<{
        id: yup.default<string, import("yup/lib/types").AnyObject, string>;
        name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        id: yup.default<string, import("yup/lib/types").AnyObject, string>;
        name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }>>;
    integration_configs: yup.ObjectSchema<{
        pms: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        activities_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        shuttle_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        pms: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        activities_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        shuttle_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
    }>, import("yup/lib/object").AssertsShape<{
        pms: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        activities_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        shuttle_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
    }>>;
    delivery_instructions: yup.default<string, import("yup/lib/types").AnyObject, string>;
    room_numbers: any;
    authorized_users: any;
    created_at: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    updated_at: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    formal_name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    code: yup.default<string, import("yup/lib/types").AnyObject, string>;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    payment_settings: import("yup/lib/object").OptionalObjectSchema<{
        allow_credit_card: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        allow_room_charge: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        allow_credit_card: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        allow_room_charge: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    }>>;
    is_tax_exempt: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    primary_contact: any;
    address: any;
    hub_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    city_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    allow_scheduled_orders: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    account_manager_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    account_manager: import("yup/lib/object").OptionalObjectSchema<{
        id: yup.default<string, import("yup/lib/types").AnyObject, string>;
        name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        id: yup.default<string, import("yup/lib/types").AnyObject, string>;
        name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }>>;
    integration_configs: yup.ObjectSchema<{
        pms: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        activities_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        shuttle_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        pms: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        activities_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        shuttle_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
    }>, import("yup/lib/object").AssertsShape<{
        pms: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        activities_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
        shuttle_app: import("yup/lib/object").OptionalObjectSchema<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>;
    }>>;
    delivery_instructions: yup.default<string, import("yup/lib/types").AnyObject, string>;
    room_numbers: any;
    authorized_users: any;
    created_at: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    updated_at: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>>;
interface DeactivateHubInput {
    hub_id: string;
    data: ReassignHubs[];
}
interface ReassignHubs {
    hotel_id: string;
    hub_id: string;
    hub_name: string;
}
declare const deactivateHubInputValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    data: import("yup/lib/array").RequiredArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        hotel_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        hotel_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        hotel_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        hotel_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>[]>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    data: import("yup/lib/array").RequiredArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        hotel_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        hotel_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        hotel_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        hotel_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>[]>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    data: import("yup/lib/array").RequiredArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        hotel_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        hotel_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        hotel_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        hotel_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_id: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        hub_name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>[]>;
}>>>;
declare type DeleteHotelInput = DeleteEntityInput;
declare const deleteHotelValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>>;
interface HotelFilter extends BaseFilter {
    name?: string;
    hub_id?: string;
    code?: string;
    city_ids?: string[];
    hub_ids?: string[];
    statuses?: string[];
    menu_ids?: string[];
}
interface OperatingWeekDays {
    [key: string]: any;
}
interface TimeRange {
    value: string;
    content: string;
    key: string;
    disabled?: boolean;
}
interface IOperatingHours {
    category: string;
    operatingHours: OperatingWeekDays;
    setOperatingHours: (category: string, day: string, value: any) => void;
    isDisabled?: boolean;
    language?: string;
}
export declare enum MealPeriod {
    Breakfast = "Breakfast",
    LunchDinner = "LunchDinner",
    Convenience = "Convenience"
}
declare enum WEEK_DAYS {
    MONDAY = "Monday",
    TUESDAY = "Tuesday",
    WEDNESDAY = "Wednesday",
    THURSDAY = "Thursday",
    FRIDAY = "Friday",
    SATURDAY = "Saturday",
    SUNDAY = "Sunday"
}
/**
 * Event Names
 */
declare enum HOTEL_EVENT {
    CREATED = "HOTEL_CREATED",
    UPDATED = "HOTEL_UPDATED",
    OMS_CREATED = "OMS_HOTEL_CREATED",
    OMS_UPDATED = "OMS_HOTEL_UPDATED",
    DELETED = "HOTEL_DELETED",
    UPDATED_INTEGRATION_CONFIGS_SHUTTLE_APP = "UPDATED_INTEGRATION_CONFIGS_SHUTTLE_APP",
    UPDATED_INTEGRATION_CONFIGS_PMS = "UPDATED_INTEGRATION_CONFIGS_PMS",
    UPDATED_INTEGRATION_CONFIGS_ACTIVITIES_APP = "UPDATED_INTEGRATION_CONFIGS_ACTIVITIES_APP",
    UPDATED_INTEGRATION_CONFIGS_MENU_APP = "UPDATED_INTEGRATION_CONFIGS_MENU_APP",
    UPDATED_INTEGRATION_CONFIGS_VOUCHERS_APP = "UPDATED_INTEGRATION_CONFIGS_VOUCHERS_APP",
    UPDATED_PAYMENT_SETTINGS = "UPDATED_PAYMENT_SETTINGS",
    STATUS_CHANGED = "HOTEL_STATUS_CHANGED",
    MENU_ASSIGNED = "HOTEL_MENU_ASSIGNED"
}
export { Hotel, IntegrationConfigs, CreateHotelInput, DeleteHotelInput, UpdateHotelInput, PatchHotelInput, DeactivateHubInput, createHotelValidator, updateHotelValidator, deleteHotelValidator, patchHotelValidator, patchIntegrationConfigsShuttleAppValidator, patchIntegrationConfigsActivitiesValidator, patchIntegrationConfigsPmsValidator, patchIntegrationConfigsMenuAppValidator, patchIntegrationConfigsVouchersAppValidator, changeHotelStatusInputValidator, deactivateHubInputValidator, authorizedUserValidator, patchPaymentSettingsValidator, PatchHotelIntegrationConfigsShuttleAppInput, PatchHotelIntegrationConfigsPmsInput, PatchHotelIntegrationConfigsVouchersAppInput, PatchHotelIntegrationConfigsActivitiesAppInput, PatchHotelIntegrationConfigsMenuAppInput, PatchHotelPaymentSettingsInput, ChangeHotelStatusInput, HotelFilter, HOTEL_EVENT, TimeRange, IOperatingHours, OperatingWeekDays, WEEK_DAYS, };

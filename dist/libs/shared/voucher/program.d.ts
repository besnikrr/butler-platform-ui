import * as yup from "yup";
import { HotelV2 } from "../network";
import { BaseEntity } from "./base";
import { ProgramCategory } from "./voucher-categories";
export interface Program extends BaseEntity {
    readonly id: number;
    readonly oms_id?: number;
    name: string;
    description: string;
    type: VoucherType;
    status: ProgramStatus;
    payer: VoucherPayer;
    payer_percentage: number;
    amount: number;
    amount_type: PaymentType;
    code_limit: number;
    rules?: ProgramRules[];
    hotels?: HotelV2[];
    category_id?: number;
}
export interface ProgramRules extends BaseEntity {
    id?: number;
    readonly oms_id?: number;
    quantity: number;
    max_price: string | number;
    program?: number;
    category: ProgramCategory[];
}
export declare enum VoucherPayer {
    BUTLER = "BUTLER",
    HOTEL = "HOTEL"
}
export declare enum PaymentType {
    PERCENTAGE = "PERCENTAGE",
    FIXED = "FIXED"
}
export declare enum VoucherType {
    DISCOUNT = "DISCOUNT",
    PER_DIEM = "PER_DIEM",
    PRE_FIXE = "PRE_FIXE"
}
export declare enum VoucherTypeLower {
    DISCOUNT = "Discount",
    PER_DIEM = "Per Diem",
    PRE_FIXE = "Pre Fixe"
}
export declare enum VoucherProgramStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare enum ProgramStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export interface Rules {
    quantity: number;
    max_price: number;
    categories: number[];
}
declare const baseVoucherValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    payer: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    payer_percentage: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    notes: yup.default<string, import("yup/lib/types").AnyObject, string>;
    description: yup.default<string, import("yup/lib/types").AnyObject, string>;
    code_limit: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    status: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    payer: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    payer_percentage: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    notes: yup.default<string, import("yup/lib/types").AnyObject, string>;
    description: yup.default<string, import("yup/lib/types").AnyObject, string>;
    code_limit: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    status: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    payer: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    payer_percentage: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    notes: yup.default<string, import("yup/lib/types").AnyObject, string>;
    description: yup.default<string, import("yup/lib/types").AnyObject, string>;
    code_limit: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    status: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>>;
declare const createVoucherProgramValidator: yup.ObjectSchema<{
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    payer: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    payer_percentage: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    notes: yup.default<string, import("yup/lib/types").AnyObject, string>;
    description: yup.default<string, import("yup/lib/types").AnyObject, string>;
    code_limit: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    status: yup.default<string, import("yup/lib/types").AnyObject, string>;
} & {
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    hotel_id: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    type: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    amount_type: yup.default<string, import("yup/lib/types").AnyObject, string>;
    amount: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    rules: yup.ArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>[], import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>[]>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    payer: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    payer_percentage: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    notes: yup.default<string, import("yup/lib/types").AnyObject, string>;
    description: yup.default<string, import("yup/lib/types").AnyObject, string>;
    code_limit: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    status: yup.default<string, import("yup/lib/types").AnyObject, string>;
} & {
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    hotel_id: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    type: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    amount_type: yup.default<string, import("yup/lib/types").AnyObject, string>;
    amount: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    rules: yup.ArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>[], import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>[]>;
}>, import("yup/lib/object").AssertsShape<{
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    payer: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    payer_percentage: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    notes: yup.default<string, import("yup/lib/types").AnyObject, string>;
    description: yup.default<string, import("yup/lib/types").AnyObject, string>;
    code_limit: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    status: yup.default<string, import("yup/lib/types").AnyObject, string>;
} & {
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    hotel_id: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    type: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    amount_type: yup.default<string, import("yup/lib/types").AnyObject, string>;
    amount: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    rules: yup.ArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>[], import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>[]>;
}>>;
declare const discountConfigValidator: yup.ObjectSchema<{
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    amount_type: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
} & {
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    amount: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    amount_type: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
} & {
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    amount: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>, import("yup/lib/object").AssertsShape<{
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    amount_type: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
} & {
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    amount: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>>;
declare const perdiemConfigValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    amount: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    amount: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    amount: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>>>;
declare const prefixeConfigValidator: yup.ObjectSchema<{
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    amount: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
} & {
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    rules: import("yup/lib/array").RequiredArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>[]>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    amount: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
} & {
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    rules: import("yup/lib/array").RequiredArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>[]>;
}>, import("yup/lib/object").AssertsShape<{
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    amount: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
} & {
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
} & {
    rules: import("yup/lib/array").RequiredArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quantity: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        max_price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
        categories: import("yup/lib/array").RequiredArraySchema<import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>, import("yup/lib/types").AnyObject, number[]>;
    }>>[]>;
}>>;
export { createVoucherProgramValidator as createVoucherProgramValidatorV2, baseVoucherValidator as baseVoucherValidatorV2, discountConfigValidator as discountConfigValidatorV2, perdiemConfigValidator as perdiemConfigValidatorV2, prefixeConfigValidator as prefixeConfigValidatorV2, };

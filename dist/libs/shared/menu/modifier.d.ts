import * as yup from "yup";
import { BaseEntity, DeleteEntityInput, BaseFilter } from "../base";
/**
 *  Main Entity
 */
interface Modifier extends BaseEntity {
    id: number;
    name: string;
    multiselect: boolean;
    options: ModifierOption[];
}
interface ModifierItem extends BaseEntity {
    type?: string;
    item?: {
        name: string;
        id: string;
    };
}
/**
 *  Modifier Option
 */
interface ModifierOption {
    name: string;
    price: number;
}
/**
 *  Action Interfaces
 */
interface CreateModifierInput {
    name: string;
    multiselect: boolean;
    options: ModifierOption[];
}
declare type DeleteModifierInput = DeleteEntityInput;
interface UpdateModifierInput {
    name: string;
    multiselect: boolean;
    options: ModifierOption[];
}
/**
 *  Filter Inputs
 */
interface ModifierFilter extends BaseFilter {
    name?: string;
}
/**
 * Event Names
 */
declare enum MODIFIER_EVENT {
    CREATED = "MODIFIER_CREATED",
    UPDATED = "MODIFIER_UPDATED",
    DELETED = "MODIFIER_DELETED"
}
declare const baseModifierValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    multiselect: import("yup/lib/boolean").RequiredBooleanSchema<boolean, import("yup/lib/types").AnyObject>;
    options: yup.ArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>[], import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>[]>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    multiselect: import("yup/lib/boolean").RequiredBooleanSchema<boolean, import("yup/lib/types").AnyObject>;
    options: yup.ArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>[], import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>[]>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    multiselect: import("yup/lib/boolean").RequiredBooleanSchema<boolean, import("yup/lib/types").AnyObject>;
    options: yup.ArraySchema<yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>[], import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        price: import("yup/lib/number").RequiredNumberSchema<number, import("yup/lib/types").AnyObject>;
    }>>[]>;
}>>>;
export { Modifier, CreateModifierInput, DeleteModifierInput, UpdateModifierInput, baseModifierValidator, ModifierFilter, ModifierOption, MODIFIER_EVENT, ModifierItem, };

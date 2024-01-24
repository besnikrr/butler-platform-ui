// interfaces
import * as yup from "yup";
import { BaseEntity, DeleteEntityInput, BaseFilter } from "../base";

/**
 *  Main Entity
 */
interface Modifier extends BaseEntity {
  id: number;
  readonly oms_id?: number;
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
  id: number;
  modifier?: number;
}

/**
 *  Action Interfaces
 */
interface CreateModifierInput {
  name: string;
  multiselect: boolean;
  options: ModifierOption[];
}

type DeleteModifierInput = DeleteEntityInput;

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
enum MODIFIER_EVENT {
  CREATED = "MODIFIER_CREATED",
  UPDATED = "MODIFIER_UPDATED",
  DELETED = "MODIFIER_DELETED",
}

/**
 *  Validation Schemas
 */
const modifierOptionValidator = yup
  .object()
  .noUnknown(true)
  .required()
  .shape({
    name: yup.string().required("Name of option is a required field!"),
    price: yup
      .number()
      .typeError("Price of option is a required field!")
      .test(
        "maxDigitsAfterDecimal",
        `Number field must have 2 digits after decimal or less`,
        (value: any) => /^\d+(\.\d{1,2})?$/.test(value.toString())
      )
      .required("Price is a required field!"),
  });

const baseModifierValidator = yup
  .object()
  .noUnknown(true)
  .required()
  .shape({
    name: yup.string().required().label("Name"),
    multiselect: yup.boolean().required(),
    options: yup
      .array()
      .required()
      .of(modifierOptionValidator)
      .min(1, "At least one option is required!"),
  });

export {
  Modifier,
  CreateModifierInput,
  DeleteModifierInput,
  UpdateModifierInput,
  baseModifierValidator,
  ModifierFilter,
  ModifierOption,
  MODIFIER_EVENT,
  ModifierItem,
};

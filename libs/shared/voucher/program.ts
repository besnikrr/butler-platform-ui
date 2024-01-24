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
  amount_type: AmountType;
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
  categories: ProgramCategory[];
}

export enum VoucherPayer {
  BUTLER = "BUTLER",
  HOTEL = "HOTEL",
}

export enum PaymentType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export enum AmountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export enum VoucherType {
  DISCOUNT = "DISCOUNT",
  PER_DIEM = "PER_DIEM",
  PRE_FIXE = "PRE_FIXE",
}

export enum VoucherTypeLower {
  DISCOUNT = "Discount",
  PER_DIEM = "Per Diem",
  PRE_FIXE = "Pre Fixe",
}

export enum VoucherProgramStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export enum ProgramStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface Rule {
  quantity: number;
  max_price: string;
  categories: any[];
  id: number;
  program: any;
}

export interface Rules {
  quantity: number;
  max_price: number;
  categories: number[];
}

const ruleValidator = yup
  .object()
  .noUnknown(true)
  .required()
  .shape({
    quantity: yup.number().typeError("Quantity is a required field!").required(),
    max_price: yup
      .number()
      .typeError("Price Limit is a required field!")
      .positive("Amount should be a positive number!")
      .required(),
    categories: yup
      .array()
      .min(1, "Categories is a required field! 1")
      .of(yup.number().typeError("Categories is a required field! 2").required())
      .required("Categories is a required field! 3"),
  });

const baseVoucherValidator = yup
  .object()
  .required()
  .shape({
    name: yup.string().required("Voucher Program is a required field!"),
    payer: yup.string().required("Payer is a required field!"),
    payer_percentage: yup.number().typeError("Payer Percentage is a required field!").required(),
    notes: yup.string().optional(),
    description: yup.string().optional(),
    code_limit: yup
      .number()
      .typeError("Code limit is a required field!")
      .moreThan(0, "Code limit must be more than 0!")
      .required(),
    status: yup.string().optional(),
  });

const createVoucherProgramValidator = baseVoucherValidator.concat(
  yup.object().shape({
    hotel_id: yup.number().typeError("Hotel is a required field!").required("Hotel is a required field!"),
    type: yup.string().required("Voucher Type is a required field!"),
    amount_type: yup.string().when("type", {
      is: VoucherType.DISCOUNT,
      then: yup.string().required("Amount Type is a required field!"),
    }),
    amount: yup.number().when("amount_type", {
      is: PaymentType.PERCENTAGE,
      then: yup
        .number()
        .typeError("Amount is a required field!")
        .moreThan(0, "Amount must be positive and more than 0%!")
        .max(100, "Amount must be less than 100%!")
        .required("Amount is a required field!"),
      otherwise: yup
        .number()
        .typeError("Amount is a required field!")
        .required("Amount is a required field!")
        .positive("Amount should be a positive number!"),
    }),
    rules: yup
      .array()
      .of(ruleValidator)
      .when("type", {
        is: VoucherType.PRE_FIXE,
        then: yup.array().of(ruleValidator).required("Categories is a required field!"),
      }),
  })
);

const amountTypeValidator = yup.object().shape({
  // DISCOUNT
  amount_type: yup.string().required("Amount Type is a required field!"),
});

const amountValidator = yup.object().shape({
  // DISCOUNT, PER_DIEM, PRE_FIXE
  amount: yup.number().when("amount_type", {
    is: PaymentType.PERCENTAGE,
    then: yup
      .number()
      .typeError("Amount is a required field!")
      .moreThan(0, "Amount must be positive and more than 0%!")
      .max(100, "Amount must be less than 100%!")
      .required(),
    otherwise: yup
      .number()
      .typeError("Amount is a required field!")
      .positive("Amount should be a positive number!")
      .required(),
  }),
});

const rulesValidator = yup.object().shape({
  // PRE_FIXE
  rules: yup.array().of(ruleValidator).required("Categories is a required field! 0"),
});

// EDIT CONFIGS
const discountConfigValidator = amountTypeValidator.concat(amountValidator);
const perdiemConfigValidator = amountValidator;
const prefixeConfigValidator = amountValidator.concat(rulesValidator);

export {
  createVoucherProgramValidator as createVoucherProgramValidatorV2,
  baseVoucherValidator as baseVoucherValidatorV2,
  discountConfigValidator as discountConfigValidatorV2,
  perdiemConfigValidator as perdiemConfigValidatorV2,
  prefixeConfigValidator as prefixeConfigValidatorV2,
};

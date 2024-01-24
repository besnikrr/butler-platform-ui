import * as yup from "yup";
import { User } from "../iam";
import { INTL_PHONE_NUMBER_REGEX, EMAIL_REGEX } from "../utils/constants";

import { BaseEntityV2, Coordinate } from "./base";
import type { HubV2 } from "./hub-v2";

export enum FeeType {
  DISABLED = "DISABLED",
  PERCENTAGE = "PERCENTAGE",
  FIXED_PRICE = "FIXED_PRICE",
}

export interface OrderRange {
  from?: number;
  to?: number | null;
}

export interface FeeValue {
  order?: number;
  fee_amount?: number;
  order_range?: OrderRange;
}

export interface ServiceFee {
  menu_id?: number;
  fee_type: FeeType;
  fee_values?: FeeValue[];
}

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
  account_manager: User;
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
  menu_id?: string | number;
  service_fee?: ServiceFee[];
  phone_number?: string;
}
interface OperatingWeekDays {
  [key: string]: any;
}

type HotelList = Hotel & { hub: HubV2 };
type HotelDetails = Hotel & { hub?: HubV2 };

type CreateHotel = Omit<
  Hotel & { address_coordinates: string; room_numbers?: string },
  "id" | "created_at" | "updated_at" | "deleted_at" | "room_numbers"
>;
type UpdateHotel = Omit<
  Partial<Hotel> & {
    address_coordinates?: string;
    room_numbers?: string;
    hub?: HubV2;
  },
  "id" | "created_at" | "updated_at" | "deleted_at" | "room_numbers"
>;

/*
  Validations schemas
 */

const createHotelValidator = yup.object().shape({
  name: yup.string().required("Hotel name is a required field!"),
  formal_name: yup.string().required("Hotel formal name is a required field!"),
  address_town: yup.string().required("Address town is a required field!"),
  address_number: yup.string().required("Address number is a required field!"),
  address_street: yup.string().required("Address street is a required field!"),
  address_zip_code: yup.string().required("Zip code is a required field!"),
  room_count: yup.string().required("Room count is a required field!"),
  room_numbers: yup.array().of(yup.string()).nullable(),
  web_code: yup
    .string()
    .max(3, "Hotel code should contain a maximum of 3 characters")
    .required("Hotel web code is a required field!"),
  code: yup
    .string()
    .max(6, "Hotel code should contain a maximum of 6 characters")
    .required("Hotel code is a required field!"),
  // Contact Information
  account_manager_id: yup.string().required("Customer success manager is a required field!"),
  contact_person: yup.string().required("Contact person is a required field!"),
  web_phone: yup
    .string()
    .matches(INTL_PHONE_NUMBER_REGEX, "Hotel contact number is not a valid phone number")
    .typeError("Web phone is not valid")
    .required("Web phone is a required field!"),
  contact_email: yup
    .string()
    .matches(EMAIL_REGEX, "Only emails are allowed for this field!")
    .required("Invoice Email Address(es) is a required field!"),
  web_url_id: yup.string().required("Web URL ID is a required field!"),
  delivery_instructions: yup.string(),
  address_coordinates: yup
    .object()
    .optional()
    .shape({
      x: yup.number().typeError("Latitude must be a number and is required!").required(),
      y: yup.number().typeError("Longitude must be a number and is required!").required(),
    }),

  // Hub
  hub_id: yup.string().required("Hub is a required field!"),

  // Edit
  has_pms_enabled: yup.boolean().optional(),

  allow_payment_room_charge: yup.boolean().optional(),
  allow_payment_credit_card: yup.boolean().optional(),
  is_tax_exempt: yup.boolean().optional(),

  has_vouchers_enabled: yup.boolean().optional(),
  has_car_service_enabled: yup.boolean().optional(),
  has_activities_enabled: yup.boolean().optional(),

  active: yup.boolean().optional().default(true),
  web_active: yup.boolean().optional(),
  allow_scheduled_orders: yup.boolean().optional(),
});

const UpdateMenuConfigs = yup.object().shape({
  web_active: yup.boolean().optional(),
  web_url_id: yup.string().required(),
  web_code: yup.string().required(),
  web_phone: yup.string().required(),
  allow_scheduled_orders: yup.boolean().optional(),
  delivery_instructions: yup.string().optional(),
});

const orderRange = yup.object().shape({
  from: yup
    .number()
    .typeError("Start Range is a required field!")
    .positive("Start Range should be a positive number!")
    .required(),
  to: yup
    .number()
    .nullable()
    .when("from", (from) => {
      return from !== null
        ? yup
            .number()
            .nullable()
            .min(from, "End Range must be after Start Range")
            .typeError("End Range is a required field!")
        : yup.number().nullable();
    }),
});

const feeValue = yup.object().shape({
  order: yup.number().typeError("Order is a required field!").required(),
  fee_amount: yup
    .number()
    .typeError("Fee Amount is a required field!")
    .positive("Fee Amount should be a positive number!")
    .required(),
  order_range: orderRange,
});

const serviceFee = yup.object().shape({
  fee_type: yup.string().typeError("Fee Type is a required field!").required("Fee Type is a required field!"),
  fee_values: yup.array().of(feeValue),
});

const serviceFeeValidator = yup.object().shape({
  service_fee: yup.array().of(serviceFee),
});

export {
  Hotel as HotelV2,
  CreateHotel,
  UpdateHotel,
  HotelList,
  HotelDetails,
  UpdateMenuConfigs,
  createHotelValidator as createHotelValidatorV2,
  serviceFeeValidator,
};

import * as yup from "yup";
import { BaseEntityV2, Coordinate } from "./base";
import type { CityV2 } from "./city-v2";
import type { HotelV2 } from "./hotel-v2";

interface Hub extends BaseEntityV2 {
  readonly id: number | string;
  readonly oms_id?: number;
  city_id?: number | string;
  city?: CityV2;
  name: string;
  active: boolean;
  tax_rate: number;
  hotels?: HotelV2[];
  contact_phone: string;
  contact_email: string;
  address_street: string;
  address_number: string;
  address_town: string;
  address_zip_code: string;
  address_coordinates: Coordinate;
  has_nextmv_enabled: boolean;
  has_expeditor_app_enabled: boolean;
  color?: string;
}

type CreateHub = Omit<Hub & { address_coordinates: string }, "id" | "created_at" | "updated_at" | "deleted_at">;

type UpdateHub = Omit<
  Partial<Hub & { address_coordinates?: string; status?: boolean }>,
  "id" | "created_at" | "updated_at" | "deleted_at" | "room_numbers"
>;

/*
  Validations schemas
 */

const createHubValidator = yup
  .object()
  .shape({
    city_id: yup.string().required("City is a required field!"),
    name: yup.string().required("Hub name is a required field!"),
    tax_rate: yup.number().typeError("Tax rate must be a number").required("Tax is a required field!"),
    contact_phone: yup
      .string()
      .isValidPhoneNumberCheck()
      .typeError("Contact number is not valid!")
      .required("Contact number is required field!"),
    contact_email: yup
      .string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Only emails are allowed for this field!")
      .required("Contact email is a required field!"),
    address_town: yup.string().required("Address town is a required field!"),
    address_number: yup.string().required("Address number is a required field!"),
    address_street: yup.string().required("Address street is a required field!"),
    address_zip_code: yup.string().required("Zip code is a required field!"),
    address_coordinates: yup
      .object()
      .optional()
      .shape({
        x: yup.number().typeError("Latitude must be a number and is required!").required(),
        y: yup.number().typeError("Longitude must be a number and is required!").required(),
      }),
    color: yup.string().required("Color is a required field!"),
  })
  .required();

export { Hub as HubV2, CreateHub, UpdateHub, createHubValidator as createHubValidatorV2 };

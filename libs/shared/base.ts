import * as yup from "yup";
import { isValidPhoneNumber } from "libphonenumber-js";
import { AxiosInstance } from "axios";

declare module "yup" {
  interface StringSchema {
    isValidPhoneNumberCheck(this: any, error?: string): StringSchema;
  }
}

interface PrimaryContact {
  name: string;
  phone: string;
  email: string;
}
const isEmail = (value: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function isValidPhoneNumberCheck(this: any, error?: string) {
  return this.test(`test-phonenumber-input`, error, (value: any) => {
    if (value && !isValidPhoneNumber(value as string)) return false;
    return true;
  });
}

yup.addMethod(
  yup.MixedSchema,
  "isValidPhoneNumberCheck",
  isValidPhoneNumberCheck
);

const primaryContactValidator = yup.object().shape({
  email: yup
    .string()
    .transform((value) => Array.from(new Set(value.split(","))).join(","))
    .required()
    .test(
      "emails",
      "Invalid email address",
      (value: any) => value && value.split(",").every(isEmail)
    ),
  phone: yup
    .string()
    .isValidPhoneNumberCheck()
    .required()
    .label("Hotel Contact Number"),
});

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

const addressValidator = yup.object().shape({
  city: yup.string().optional().label("City"),
  country: yup.string().required().label("Country"),
  line1: yup.string().required().label("Address 1"),
  line2: yup.string(),
  zip_code: yup.string().required().label("Zip code"),
  state: yup.string().required().label("State"),
});

interface Coordinates {
  latitude: number;
  longitude: number;
}

const coordinatesValidator = yup.object().shape({
  latitude: yup.string(),
  longitude: yup.string(),
});

interface DeleteEntityInput {
  id: string;
}

const deleteEntityValidator = yup.object().shape({
  id: yup.string(),
});

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

type QueryListByIdProps = QueryListProps & { id: number };

interface QueryDetailsProps {
  id: number | string;
  enabled?: boolean;
}

export {
  PrimaryContact,
  BaseEntity,
  Address,
  Coordinates,
  DeleteEntityInput,
  primaryContactValidator,
  addressValidator,
  coordinatesValidator,
  deleteEntityValidator,
  ActionContext,
  BaseFilter,
  AuthorizedUser,
  QueryListProps,
  QueryDetailsProps,
  QueryListByIdProps,
};

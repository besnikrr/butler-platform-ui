import * as yup from "yup";
import { Hub, ReferenceEntity } from "./hub";
import {
  PrimaryContact,
  BaseFilter,
  Address,
  addressValidator,
  BaseEntity,
  Coordinates,
  DeleteEntityInput,
  deleteEntityValidator,
  primaryContactValidator,
} from "../base";

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
  payment_settings: { allow_credit_card: boolean; allow_room_charge: boolean };
  is_tax_exempt: boolean;
  primary_contact?: PrimaryContact;
  address: Address;
  coordinates: Coordinates;
  hub_id: string;
  hub: ReferenceEntity;
  city_id: string;
  city: ReferenceEntity;
  account_manager_id: string;
  account_manager: { id: string; name: string };
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
  payment_settings: { allow_credit_card: boolean; allow_room_charge: boolean };
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

const authorizedUserValidator = yup.object().shape({
  first_name: yup.string().required().label("First Name"),
  last_name: yup.string().required().label("Last Name"),
  email: yup.string().email().required().label("Email"),
});

const createHotelValidator = yup.object().shape({
  name: yup.string().required().label("Hotel Name"),
  formal_name: yup.string(),
  city_id: yup.string().required().label("City"),
  code: yup.string().max(6, "Hotel code should contain a maximum of 6 characters").required().label("Hotel code"),
  active: yup.boolean().optional().default(true),
  is_tax_exempt: yup.boolean().optional().default(false),
  primary_contact: primaryContactValidator,
  address: addressValidator,
  hub_id: yup.string().required().label("Hub"),
  account_manager_id: yup.string().required().label("Customer Success Manager"),
  room_numbers: yup.array().of(yup.number()).label("Room Number Count"),
  authorized_users: yup.array().of(authorizedUserValidator).optional().label("Authorized users"),
  room_count: yup.string().required().label("Room count"),
});

interface UpdateHotelInput {
  id: string;
  name: string;
  formal_name: string;
  code: string;
  active: boolean;
  payment_settings: { allow_credit_card: boolean; allow_room_charge: boolean };
  is_tax_exempt: boolean;
  primary_contact: PrimaryContact;
  address: Address;
  hub_id: string;
  hub: Hub;
  city_id?: string;
  city?: ReferenceEntity;
  allow_scheduled_orders: boolean;
  account_manager_id: string;
  account_manager: { id: string; name: string };
  integration_configs: IntegrationConfigs;
  delivery_instructions: string;
  menu_id: string;
  room_count: number;
  room_numbers?: string[];
  coordinates: Coordinates;
  authorized_users?: AuthorizedUserHOAM[];
}

const updateHotelValidator = yup.object({
  id: yup.string(),
  name: yup.string(),
  formal_name: yup.string(),
  code: yup.string().min(3).max(6),
  active: yup.boolean().default(false),
  payment_settings: yup.object({
    allow_credit_card: yup.boolean().default(false),
    allow_room_charge: yup.boolean().default(false),
  }),
  menu_id: yup.string().label("Menu"),
  is_tax_exempt: yup.boolean().default(false),
  primary_contact: primaryContactValidator,
  address: addressValidator,
  hub_id: yup.string(),
  allow_scheduled_orders: yup.boolean().default(false),
  account_manager_id: yup.string(),
  account_manager: yup.object({ id: yup.string(), name: yup.string() }).optional(),
  integration_configs: yup.object({
    pms: yup.object({
      enabled: yup.boolean(),
    }),
    activities_app: yup.object({
      enabled: yup.boolean(),
    }),
    shuttle_app: yup.object({
      enabled: yup.boolean(),
    }),
  }),
  delivery_instructions: yup.string(),
  room_numbers: yup.array().of(yup.number()).label("Room number"),
  authorized_users: yup.array().of(authorizedUserValidator).optional().label("Authorized users"),
  created_at: yup.number().optional(),
  updated_at: yup.number().optional(),
});

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

const patchIntegrationConfigsShuttleAppValidator = yup.object({
  enabled: yup.boolean(),
});

const patchIntegrationConfigsVouchersAppValidator = yup.object({
  enabled: yup.boolean(),
  authorized_users: yup.array().of(authorizedUserValidator).optional().label("Authorized users"),
});

const patchIntegrationConfigsPmsValidator = yup.object({
  enabled: yup.boolean(),
});

const patchIntegrationConfigsActivitiesValidator = yup.object({
  enabled: yup.boolean(),
});

const patchPaymentSettingsValidator = yup.object({
  allow_credit_card: yup.boolean().default(false),
  allow_room_charge: yup.boolean().default(false),
});

const changeHotelStatusInputValidator = yup.object({
  active: yup.boolean().required(),
});

const patchIntegrationConfigsMenuAppValidator = yup.object({
  web_id: yup.string().required().label("Web Id"),
  web_code: yup.string().required().label("Web Code"),
  web_phone: yup.string().required().label("Web Phone"),
  allow_scheduled_orders: yup.boolean().required().label("Allow Scheduled Orders"),
  delivery_instructions: yup.string().label("Delivery Instructions"),
});

const patchHotelValidator = yup.object({
  name: yup.string().optional(),
  formal_name: yup.string().optional(),
  code: yup.string().optional(),
  active: yup.boolean().default(false).optional(),
  payment_settings: yup
    .object({
      allow_credit_card: yup.boolean().default(false),
      allow_room_charge: yup.boolean().default(false),
    })
    .optional(),
  is_tax_exempt: yup.boolean().default(false).optional(),
  primary_contact: primaryContactValidator.optional().default(undefined),
  address: addressValidator.optional().default(undefined),
  hub_id: yup.string().optional(),
  city_id: yup.string().optional(),
  allow_scheduled_orders: yup.boolean().default(false).optional(),
  account_manager_id: yup.string().optional(),
  account_manager: yup.object({ id: yup.string(), name: yup.string() }).optional(),
  integration_configs: yup
    .object({
      pms: yup.object({
        enabled: yup.boolean(),
      }),
      activities_app: yup.object({
        enabled: yup.boolean(),
      }),

      shuttle_app: yup.object({
        enabled: yup.boolean(),
      }),
    })
    .optional()
    .default(undefined),
  delivery_instructions: yup.string().optional(),
  room_numbers: yup.array().of(yup.number()).optional(),
  authorized_users: yup.array().of(authorizedUserValidator).optional().label("Authorized users"),
  created_at: yup.number().optional(),
  updated_at: yup.number().optional(),
});

interface DeactivateHubInput {
  hub_id: string;
  data: ReassignHubs[];
}

interface ReassignHubs {
  hotel_id: string;
  hub_id: string;
  hub_name: string;
}

const reassignHubs = yup.object().shape({
  hotel_id: yup.string().required(),
  hub_id: yup.string().required(),
  hub_name: yup.string().required(),
});

const deactivateHubInputValidator = yup.object().shape({
  hub_id: yup.string().required(),
  data: yup.array().of(reassignHubs).required(),
});

type DeleteHotelInput = DeleteEntityInput;

const deleteHotelValidator = deleteEntityValidator;

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

export enum MealPeriod {
  Breakfast = "Breakfast",
  Lunch_Dinner = "Lunch_Dinner",
  Convenience = "Convenience",
}

enum WEEK_DAYS {
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
  SUNDAY = "Sunday",
}
/**
 * Event Names
 */
enum HOTEL_EVENT {
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
  MENU_ASSIGNED = "HOTEL_MENU_ASSIGNED",
}

export {
  Hotel,
  IntegrationConfigs,
  CreateHotelInput,
  DeleteHotelInput,
  UpdateHotelInput,
  PatchHotelInput,
  DeactivateHubInput,
  createHotelValidator,
  updateHotelValidator,
  deleteHotelValidator,
  patchHotelValidator,
  patchIntegrationConfigsShuttleAppValidator,
  patchIntegrationConfigsActivitiesValidator,
  patchIntegrationConfigsPmsValidator,
  patchIntegrationConfigsMenuAppValidator,
  patchIntegrationConfigsVouchersAppValidator,
  changeHotelStatusInputValidator,
  deactivateHubInputValidator,
  authorizedUserValidator,
  patchPaymentSettingsValidator,
  PatchHotelIntegrationConfigsShuttleAppInput,
  PatchHotelIntegrationConfigsPmsInput,
  PatchHotelIntegrationConfigsVouchersAppInput,
  PatchHotelIntegrationConfigsActivitiesAppInput,
  PatchHotelIntegrationConfigsMenuAppInput,
  PatchHotelPaymentSettingsInput,
  ChangeHotelStatusInput,
  HotelFilter,
  HOTEL_EVENT,
  TimeRange,
  IOperatingHours,
  OperatingWeekDays,
  WEEK_DAYS,
};

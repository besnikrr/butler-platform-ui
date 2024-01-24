import * as yup from "yup";
import {
  Address,
  addressValidator,
  BaseEntity,
  Coordinates,
  coordinatesValidator,
  DeleteEntityInput,
  deleteEntityValidator,
  primaryContactValidator,
  BaseFilter,
  PrimaryContact,
} from "../base";
import { updateCityValidator } from "./city";

interface Hub extends BaseEntity {
  id: number;
  name: string;
  city_id: number;
  city: ReferenceEntity;
  address: Address;
  primary_contact: PrimaryContact;
  active: boolean;
  tax: { percentage: number };
  coordinates?: Coordinates;
  integration_configs: {
    quick_books: {
      class: string;
    };
    expeditor_app: {
      enabled: boolean;
    };
    next_move_app: {
      enabled: boolean;
    };
  };
  aggregates: {
    count_hotels: number;
  };
}

interface ReferenceEntity {
  id: number;
  name: string;
}
interface CreateHubInput {
  name: string;
  primary_contact: PrimaryContact;
  address: Address;
  coordinates?: Coordinates;
  tax: { percentage: number };
  city_id: string;
  city: ReferenceEntity;
  active: boolean;
  integration_configs: {
    quick_books: {
      class: string;
    };
    expeditor_app: {
      enabled: boolean;
    };
    next_move_app: {
      enabled: boolean;
    };
  };
}

const createHubValidator = yup
  .object()
  .shape({
    name: yup.string().required().label("Hub name"),
    primary_contact: primaryContactValidator.required(),
    address: addressValidator.required(),
    city_id: yup.string().required(),
    active: yup.boolean().required(),
    tax: yup.object().shape({ percentage: yup.number().required() }).required(),
    coordinates: coordinatesValidator.optional(),
    integration_configs: yup.object().shape({
      quick_books: yup
        .object({
          class: yup.string(),
        })
        .optional(),
      expeditor_app: yup.object().shape({
        enabled: yup.boolean(),
      }),
      next_move_app: yup.object().shape({
        enabled: yup.boolean(),
      }),
    }),
  })
  .required();

interface UpdateHubInput {
  name: string;
  city_id: string;
  address: Address;
  primary_contact: PrimaryContact;
  active: boolean;
  tax: { percentage: number };
  coordinates: Coordinates;
  integration_configs: {
    quick_books: {
      class: string;
    };
    expeditor_app: {
      enabled: boolean;
    };
    next_move_app: {
      enabled: boolean;
    };
  };
}

interface PatchHubInput {
  name?: string;
  city_id?: string;
  address?: Address;
  primary_contact?: PrimaryContact;
  active?: boolean;
  tax?: { percentage?: number };
  coordinates?: Coordinates;
  integration_configs?: {
    quick_books?: {
      class: string;
    };
    expeditor_app?: {
      enabled: boolean;
    };
    next_move_app?: {
      enabled: boolean;
    };
  };
}

const patchHubValidator = yup.object().shape({
  name: yup.string().optional(),
  city_id: yup.string().optional(),
  city: updateCityValidator.optional().default(undefined),
  address: addressValidator.optional().default(undefined),
  primary_contact: primaryContactValidator.optional().default(undefined),
  active: yup.boolean().optional(),
  tax: yup
    .object()
    .shape({
      percentage: yup.number(),
    })
    .optional()
    .default(undefined),
  coordinates: coordinatesValidator.optional().default(undefined),
  integration_configs: yup
    .object()
    .shape({
      quick_books: yup
        .object()
        .shape({
          class: yup.string(),
        })
        .optional(),
      expeditor_app: yup.object().shape({
        enabled: yup.boolean(),
      }),
      next_move_app: yup.object().shape({
        enabled: yup.boolean(),
      }),
    })
    .optional()
    .default(undefined),
});

const updateHubValidator = yup.object().shape({
  name: yup.string().required().label("Hub Name"),
  city_id: yup.string(),
  address: addressValidator,
  primary_contact: primaryContactValidator,
  active: yup.boolean(),
  tax: yup.object().shape({ percentage: yup.number() }),
  coordinates: coordinatesValidator,
  integration_configs: yup.object().shape({
    quick_books: yup
      .object()
      .shape({
        class: yup.string(),
      })
      .optional(),
    expeditor_app: yup.object().shape({
      enabled: yup.boolean(),
    }),
    next_move_app: yup.object().shape({
      enabled: yup.boolean(),
    }),
  }),
});

type DeleteHubInput = DeleteEntityInput;

const deleteHubValidator = deleteEntityValidator;

interface HubFilter extends BaseFilter {
  city_ids?: string[];
  name?: string;
  statuses?: string[];
}

enum HUB_EVENT {
  CREATED = "HUB_CREATED",
  UPDATED = "HUB_UPDATED",
  OMS_CREATED = "OMS_CREATED",
  OMS_UPDATED = "OMS_UPDATED",
  DELETED = "HUB_DELETED",
  DEACTIVATED = "HUB_DEACTIVATED",
}

export {
  Hub,
  CreateHubInput,
  UpdateHubInput,
  DeleteHubInput,
  PatchHubInput,
  ReferenceEntity,
  HubFilter,
  createHubValidator,
  updateHubValidator,
  deleteHubValidator,
  patchHubValidator,
  HUB_EVENT,
};

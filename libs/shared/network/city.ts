import * as yup from "yup";
import { BaseEntity, DeleteEntityInput, deleteEntityValidator, BaseFilter } from "../base";

/**
 *  Main Entity
 */
interface City extends BaseEntity {
  id?: string;
  name: string;
  time_zone: string;
  state: string;
  country: string;
  aggregates: {
    count_hubs: number;
    count_hotels: number;
  };
}

/**
 *  Action Interfaces
 */
interface CreateCityInput {
  name: string;
  time_zone: string;
  state: string;
  country: string;
}

interface PutCityInput {
  pk: string;
  sk: string;
  name: string;
  time_zone: string;
  state: string;
  country: string;
}

interface PatchCityInput {
  name?: string;
  time_zone?: string;
  state?: string;
  country?: string;
}

type DeleteCityInput = DeleteEntityInput;

interface UpdateCityInput {
  name?: string;
  time_zone?: string;
  state?: string;
  country?: string;
}

/**
 *  Validation Schemas
 */
const createCityValidator = yup.object().shape({
  name: yup.string().required(),
  time_zone: yup.string().required(),
  state: yup.string().required(),
  country: yup.string().required(),
});

const updateCityValidator = yup.object().shape({
  name: yup.string().optional(),
  time_zone: yup.string().optional(),
  state: yup.string().optional(),
  country: yup.string().optional(),
});

const patchCityValidator = yup.object().shape({
  name: yup.string().optional(),
  time_zone: yup.string().optional(),
  state: yup.string().optional(),
  country: yup.string().optional(),
});

const deleteCityValidator = deleteEntityValidator;

/**
 *  Filter Inputs
 */

interface CityFilter extends BaseFilter {
  names?: string[];
  name?: string;
}

/**
 * Event Names
 */
enum CITY_EVENT {
  CREATED = "CITY_CREATED",
  UPDATED = "CITY_UPDATED",
  DELETED = "CITY_DELETED",
}

export {
  City,
  CreateCityInput,
  PutCityInput,
  PatchCityInput,
  patchCityValidator,
  DeleteCityInput,
  UpdateCityInput,
  createCityValidator,
  updateCityValidator,
  deleteCityValidator,
  CityFilter,
  CITY_EVENT,
};

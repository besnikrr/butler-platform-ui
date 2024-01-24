import * as yup from "yup";
import { BaseEntityV2 } from "./base";
import { Hub } from "./hub";
import { HubV2 } from "./hub-v2";

interface City extends BaseEntityV2 {
  readonly id: number;
  readonly oms_id?: number;
  name: string;
  state?: string;
  time_zone: string;
  hubs?: Hub[];
}

type CityList = City & { hubs: HubV2[] };
type CreateCity = Omit<City, "id" | "created_at" | "updated_at" | "deleted_at">;

/**
 *  Validation Schemas
 */
const createCityValidator = yup
  .object()
  .noUnknown(true)
  .required()
  .shape({
    name: yup.string().required("Name is a required field!"),
    time_zone: yup.string().required("Time zone is a required field!"),
    state: yup.string().optional(),
  });

export {
  City as CityV2,
  CreateCity,
  CityList,
  createCityValidator as createCityValidatorV2,
};

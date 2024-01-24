import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  CityV2,
  HTTPResourceResponse,
  QueryDetailsProps,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi } from "@butlerhospitality/ui-sdk";
import { cityKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function fetchCity({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<CityV2>> {
  const [, , id, networkServiceApi] = queryKey;

  const result = await (networkServiceApi as AxiosInstance).get<
    HTTPResourceResponse<CityV2>
  >(`${BASE_URL}/cities/${id}`);

  return result.data;
}

export function useFetchCity({ id }: QueryDetailsProps) {
  const networkServiceApi = useApi(AppEnum.NETWORK);

  return useQuery([...cityKeys.details(id), networkServiceApi], fetchCity);
}

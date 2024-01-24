import { useContext } from "react";
import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  CityList,
  HTTPResourceResponse,
  QueryListProps,
  PERMISSION,
  PAGE_SIZE,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { AppContext, useApi } from "@butlerhospitality/ui-sdk";
import { cityKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function fetchCities({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<CityList[]>> {
  const [, , page, search, networkServiceApi] = queryKey;
  const result = await (networkServiceApi as AxiosInstance).get<
    HTTPResourceResponse<CityList[]>
  >(
    search
      ? `${BASE_URL}/cities?name=${search}&page=${page}&limit=${PAGE_SIZE}`
      : `${BASE_URL}/cities?page=${page}&limit=${PAGE_SIZE}`
  );

  return result.data;
}

export function useFetchCities({ page = 1, search }: QueryListProps) {
  const { can } = useContext(AppContext);
  const networkServiceApi = useApi(AppEnum.NETWORK);

  const canGetCities = can(PERMISSION.NETWORK.CAN_GET_CITIES);

  return useQuery(
    [...cityKeys.list(page), search, networkServiceApi],
    fetchCities,
    {
      enabled: canGetCities,
      notifyOnChangeProps: ["data"],
    }
  );
}

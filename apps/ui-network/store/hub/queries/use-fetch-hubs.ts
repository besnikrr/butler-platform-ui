import { useContext } from "react";
import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  HubV2,
  HTTPResourceResponse,
  PERMISSION,
  QueryListProps,
  parseFilters,
  PAGE_SIZE,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { AppContext, useApi } from "@butlerhospitality/ui-sdk";
import { BASE_URL } from "../../../shared/constants";
import { hubKeys } from "../query-keys";

async function fetchHubs({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<HubV2[]>> {
  const [, , page, search, networkServiceApi] = queryKey;

  const result = await (networkServiceApi as AxiosInstance).get<
    HTTPResourceResponse<HubV2[]>
  >(`${BASE_URL}/hubs?${search}page=${page}&limit=${PAGE_SIZE}`);

  return result.data;
}

export function useFetchHubs({
  page = 1,
  search,
  filters,
  enabled = true,
}: QueryListProps) {
  const { can } = useContext(AppContext);
  const networkServiceApi = useApi(AppEnum.NETWORK);

  const canGetHubs = can(PERMISSION.NETWORK.CAN_GET_HUBS);

  const parsedFilters = parseFilters(filters);
  const appliedFilters = search
    ? `name=${search}&${parsedFilters}&`
    : `${parsedFilters}&`;

  return useQuery(
    [...hubKeys.list(page), appliedFilters, networkServiceApi],
    fetchHubs,
    {
      enabled: enabled && canGetHubs,
      notifyOnChangeProps: ["data"],
    }
  );
}

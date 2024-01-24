import { useContext } from "react";
import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  HotelList,
  HTTPResourceResponse,
  QueryListProps,
  PERMISSION,
  PAGE_SIZE,
  parseFilters,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { AppContext, useApi } from "@butlerhospitality/ui-sdk";
import { BASE_URL } from "../../../shared/constants";
import { hotelKeys } from "../query-keys";

async function fetchHotels({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<HotelList[]>> {
  const [, , page, search, networkServiceApi] = queryKey;

  const result = await (networkServiceApi as AxiosInstance).get<
    HTTPResourceResponse<HotelList[]>
  >(`${BASE_URL}/hotels?${search}page=${page}&limit=${PAGE_SIZE}`);

  return result.data;
}

export function useFetchHotels({ page = 1, search, filters }: QueryListProps) {
  const { can } = useContext(AppContext);
  const networkServiceApi = useApi(AppEnum.NETWORK);

  const canGetHotels = can(PERMISSION.NETWORK.CAN_GET_HOTELS);

  const parsedFilters = parseFilters(filters);
  const appliedFilters = search
    ? `name=${search}&${parsedFilters}`
    : `${parsedFilters}`;

  return useQuery(
    [...hotelKeys.list(page), appliedFilters, networkServiceApi],
    fetchHotels,
    {
      enabled: canGetHotels,
      notifyOnChangeProps: ["data"],
    }
  );
}

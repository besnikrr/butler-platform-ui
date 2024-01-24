import { useContext } from "react";
import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  HTTPResourceResponse,
  QueryListProps,
  PERMISSION,
  HotelProgramList,
  PAGE_SIZE,
  parseFilters,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { AppContext, useApi } from "@butlerhospitality/ui-sdk";
import { BASE_URL } from "../../../shared/constants";
import { hotelProgramKeys } from "../query-keys";

async function fetchHotelPrograms({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<HotelProgramList[]>> {
  const [, , page, search, voucherServiceApi] = queryKey;

  const result = await (voucherServiceApi as AxiosInstance).get<
    HTTPResourceResponse<HotelProgramList[]>
  >(`${BASE_URL}/program-hotels?${search}page=${page}&limit=${PAGE_SIZE}`);

  return result.data;
}

export function useFetchHotelPrograms({
  page = 1,
  search,
  filters,
}: QueryListProps) {
  const { can } = useContext(AppContext);
  const voucherServiceApi = useApi(AppEnum.VOUCHER);

  const canGetHotelPrograms = can(
    PERMISSION.VOUCHER.CAN_LIST_VOUCHER_PROGRAMS_HOTELS
  );

  const parsedFilters = parseFilters(filters);
  const appliedFilters = search
    ? `name=${search}&${parsedFilters}`
    : `${parsedFilters}`;

  return useQuery(
    [...hotelProgramKeys.list(page), appliedFilters, voucherServiceApi],
    fetchHotelPrograms,
    {
      enabled: canGetHotelPrograms,
      notifyOnChangeProps: ["data"],
    }
  );
}

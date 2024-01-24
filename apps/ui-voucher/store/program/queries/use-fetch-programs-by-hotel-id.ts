import { useContext } from "react";
import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  HTTPResourceResponse,
  QueryListByIdProps,
  PERMISSION,
  Program,
  PAGE_SIZE,
  parseFilters,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { AppContext, useApi } from "@butlerhospitality/ui-sdk";
import { BASE_URL } from "../../../shared/constants";
import { programKeys } from "../query-keys";

async function fetchProgramsByHotelId({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<Program[]>> {
  const [, , page, id, search, voucherServiceApi] = queryKey;

  const result = await (voucherServiceApi as AxiosInstance).get<
    HTTPResourceResponse<Program[]>
  >(
    `${BASE_URL}/programs/hotel/${id}?${search}page=${page}&limit=${PAGE_SIZE}`
  );

  return result.data;
}

export function useFetchProgramsByHotelId({
  id,
  page = 1,
  search,
  filters,
}: QueryListByIdProps) {
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
    [...programKeys.list(page), id, appliedFilters, voucherServiceApi],
    fetchProgramsByHotelId,
    {
      enabled: canGetHotelPrograms,
      notifyOnChangeProps: ["data"],
    }
  );
}

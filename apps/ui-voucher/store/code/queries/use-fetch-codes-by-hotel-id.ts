import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  HTTPResourceResponse,
  QueryListByIdProps,
  Code,
  PAGE_SIZE,
  parseFilters,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi } from "@butlerhospitality/ui-sdk";
import { BASE_URL } from "../../../shared/constants";
import { codeKeys } from "../query-keys";

async function fetchCodesByHotelId({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<Code[]>> {
  const [, , page, id, search, voucherServiceApi] = queryKey;

  const result = await (voucherServiceApi as AxiosInstance).get<
    HTTPResourceResponse<Code[]>
  >(`${BASE_URL}/codes/${id}?${search}page=${page}&limit=${PAGE_SIZE}`);

  return result.data;
}

export function useFetchCodesByHotelId({
  id,
  page = 1,
  search,
  filters,
}: QueryListByIdProps) {
  const voucherServiceApi = useApi(AppEnum.VOUCHER);

  const parsedFilters = parseFilters(filters);
  const appliedFilters = search
    ? `name=${search}&${parsedFilters}`
    : `${parsedFilters}`;

  return useQuery(
    [...codeKeys.list(page), id, appliedFilters, voucherServiceApi],
    fetchCodesByHotelId,
    {
      notifyOnChangeProps: ["data"],
    }
  );
}

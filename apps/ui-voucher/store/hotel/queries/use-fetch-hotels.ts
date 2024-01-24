import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  HotelList,
  HTTPResourceResponse,
  QueryListProps,
  PAGE_SIZE,
  parseFilters,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi } from "@butlerhospitality/ui-sdk";
import { BASE_URL } from "../../../shared/constants";
import { voucherHotelKeys } from "../query-keys";

async function fetchHotels({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<HotelList[]>> {
  const [, , page, search, voucherServiceApi] = queryKey;

  const result = await (voucherServiceApi as AxiosInstance).get<
    HTTPResourceResponse<HotelList[]>
  >(
    search
      ? `${BASE_URL}/hotels?${search}&page=${page}&limit=${PAGE_SIZE}`
      : `${BASE_URL}/hotels?page=${page}&limit=${PAGE_SIZE}`
  );

  return result.data;
}

export function useFetchHotels({ page = 1, search, filters }: QueryListProps) {
  const voucherServiceApi = useApi(AppEnum.VOUCHER);

  const parsedFilters = parseFilters(filters);
  const appliedFilters = `${search ? `name=${search}` : ""}&${parsedFilters}`;

  return useQuery(
    [...voucherHotelKeys.list(page), appliedFilters, voucherServiceApi],
    fetchHotels,
    {
      notifyOnChangeProps: ["data"],
    }
  );
}

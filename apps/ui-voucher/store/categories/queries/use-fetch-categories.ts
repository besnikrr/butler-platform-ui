import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  ProgramCategory,
  HTTPResourceResponse,
  QueryListProps,
  PAGE_SIZE,
  parseFilters,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi } from "@butlerhospitality/ui-sdk";
import { BASE_URL } from "../../../shared/constants";
import { programCategoryKeys } from "../query-keys";

async function fetchCategories({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<ProgramCategory[]>> {
  const [, , page, search, voucherServiceApi] = queryKey;

  const result = await (voucherServiceApi as AxiosInstance).get<
    HTTPResourceResponse<ProgramCategory[]>
  >(
    search
      ? `${BASE_URL}/categories?${search}&page=${page}&limit=${PAGE_SIZE}`
      : `${BASE_URL}/categories?page=${page}&limit=${PAGE_SIZE}`
  );

  return result.data;
}

export function useFetchCategories({
  page = 1,
  search,
  filters,
}: QueryListProps) {
  const voucherServiceApi = useApi(AppEnum.VOUCHER);

  const parsedFilters = parseFilters(filters);
  const appliedFilters = `${search ? `name=${search}` : ""}&${parsedFilters}`;

  return useQuery(
    [...programCategoryKeys.list(page), appliedFilters, voucherServiceApi],
    fetchCategories,
    {
      notifyOnChangeProps: ["data"],
    }
  );
}

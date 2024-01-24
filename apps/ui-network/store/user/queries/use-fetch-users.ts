import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  User,
  HTTPResourceResponse,
  QueryListProps,
  PAGE_SIZE,
  parseFilters,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi } from "@butlerhospitality/ui-sdk";
import { BASE_URL } from "../../../shared/constants";
import { userKeys } from "../query-keys";

async function fetchUsers({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<User[]>> {
  const [, , page, search, networkServiceApi] = queryKey;

  const result = await (networkServiceApi as AxiosInstance).get<
    HTTPResourceResponse<User[]>
  >(
    search
      ? `${BASE_URL}/users?${search}&page=${page}&limit=${PAGE_SIZE}`
      : `${BASE_URL}/users?page=${page}&limit=${PAGE_SIZE}`
  );

  return result.data;
}

export function useFetchUsers({ page = 1, search, filters }: QueryListProps) {
  const networkServiceApi = useApi(AppEnum.NETWORK);

  const parsedFilters = parseFilters(filters);
  const appliedFilters = `${search ? `name=${search}` : ""}&${parsedFilters}`;

  return useQuery(
    [...userKeys.list(page), appliedFilters, networkServiceApi],
    fetchUsers,
    {
      notifyOnChangeProps: ["data"],
    }
  );
}

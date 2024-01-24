import { useContext } from "react";
import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  HTTPResourceResponse,
  QueryListProps,
  PERMISSION,
  PAGE_SIZE,
  User,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { AppContext, useApi } from "@butlerhospitality/ui-sdk";
import { BASE_URL } from "../../../shared/constants";
import { userKeys } from "../query-keys";

async function fetchUsers({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<User[]>> {
  const [, , page, search, iamServiceApi] = queryKey;

  const result = await (iamServiceApi as AxiosInstance).get<
    HTTPResourceResponse<User[]>
  >(
    search
      ? `${BASE_URL}/users?search=${search}&page=${page}&limit=${PAGE_SIZE}`
      : `${BASE_URL}/users?page=${page}&limit=${PAGE_SIZE}`
  );

  return result.data;
}

export function useFetchUsers({
  page = 1,
  search,
  enabled = true,
}: QueryListProps) {
  const { can } = useContext(AppContext);
  const iamServiceApi = useApi(AppEnum.IAM);
  const canListUsers = can && can(PERMISSION.IAM.CAN_LIST_USERS);

  return useQuery([...userKeys.list(page), search, iamServiceApi], fetchUsers, {
    enabled: canListUsers && enabled,
    notifyOnChangeProps: ["data"],
  });
}

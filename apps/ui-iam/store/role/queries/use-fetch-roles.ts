import { useContext } from "react";
import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  HTTPResourceResponse,
  QueryListProps,
  PERMISSION,
  PAGE_SIZE,
  Role,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { AppContext, useApi } from "@butlerhospitality/ui-sdk";
import { BASE_URL } from "../../../shared/constants";
import { roleKeys } from "../query-keys";

async function fetchRoles({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<Role[]>> {
  const [, , page, search, iamServiceApi] = queryKey;

  const result = await (iamServiceApi as AxiosInstance).get<
    HTTPResourceResponse<Role[]>
  >(
    search
      ? `${BASE_URL}/roles?search=${search}&page=${page}&limit=${PAGE_SIZE}`
      : `${BASE_URL}/roles?page=${page}&limit=${PAGE_SIZE}`
  );

  return result.data;
}

export function useFetchRoles({
  page = 1,
  search,
  enabled = true,
}: QueryListProps) {
  const { can } = useContext(AppContext);
  const iamServiceApi = useApi(AppEnum.IAM);
  const canListRoles = can && can(PERMISSION.IAM.CAN_LIST_ROLES);

  return useQuery([...roleKeys.list(page), search, iamServiceApi], fetchRoles, {
    enabled: canListRoles && enabled,
    notifyOnChangeProps: ["data"],
  });
}

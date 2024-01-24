import { useContext } from "react";
import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  HTTPResourceResponse,
  QueryListProps,
  PERMISSION,
  PAGE_SIZE,
  PermissionGroup,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { AppContext, useApi } from "@butlerhospitality/ui-sdk";
import { BASE_URL } from "../../../shared/constants";
import { permissionGroupKeys } from "../query-keys";

async function fetchPermissionGroups({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<PermissionGroup[]>> {
  const [, , page, search, iamServiceApi] = queryKey;

  const result = await (iamServiceApi as AxiosInstance).get<
    HTTPResourceResponse<PermissionGroup[]>
  >(
    search
      ? `${BASE_URL}/permissiongroups?search=${search}&page=${page}&limit=${PAGE_SIZE}`
      : `${BASE_URL}/permissiongroups?page=${page}&limit=${PAGE_SIZE}`
  );

  return result.data;
}

export function useFetchPermissionGroups({
  page = 1,
  search,
  enabled = true,
}: QueryListProps) {
  const { can } = useContext(AppContext);
  const iamServiceApi = useApi(AppEnum.IAM);
  const canListPermissionGroups =
    can && can(PERMISSION.IAM.CAN_LIST_PERMISSION_GROUPS);

  return useQuery(
    [...permissionGroupKeys.list(page), search, iamServiceApi],
    fetchPermissionGroups,
    {
      enabled: canListPermissionGroups && enabled,
      notifyOnChangeProps: ["data"],
    }
  );
}

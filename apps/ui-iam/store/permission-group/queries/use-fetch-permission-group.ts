import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  HTTPResourceResponse,
  QueryDetailsProps,
  PermissionGroup,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi } from "@butlerhospitality/ui-sdk";
import { permissionGroupKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function fetchPermissionGroup({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<PermissionGroup>> {
  const [, , id, iamServiceApi] = queryKey;

  const result = await (iamServiceApi as AxiosInstance).get<
    HTTPResourceResponse<PermissionGroup>
  >(`${BASE_URL}/permissiongroups/${id}`);

  return result.data;
}

export function useFetchPermissionGroup({ id }: QueryDetailsProps) {
  const iamServiceApi = useApi(AppEnum.IAM);

  return useQuery(
    [...permissionGroupKeys.details(id), iamServiceApi],
    fetchPermissionGroup
  );
}

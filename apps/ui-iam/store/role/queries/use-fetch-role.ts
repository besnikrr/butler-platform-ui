import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  Role,
  HTTPResourceResponse,
  QueryDetailsProps,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi } from "@butlerhospitality/ui-sdk";
import { roleKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function fetchRole({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<Role>> {
  const [, , id, iamServiceApi] = queryKey;

  const result = await (iamServiceApi as AxiosInstance).get<
    HTTPResourceResponse<Role>
  >(`${BASE_URL}/roles/${id}`);

  return result.data;
}

export function useFetchRole({ id }: QueryDetailsProps) {
  const iamServiceApi = useApi(AppEnum.IAM);

  return useQuery([...roleKeys.details(id), iamServiceApi], fetchRole);
}

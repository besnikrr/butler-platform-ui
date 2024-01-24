import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  User,
  HTTPResourceResponse,
  QueryDetailsProps,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi } from "@butlerhospitality/ui-sdk";
import { userKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function fetchUser({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<User>> {
  const [, , id, iamServiceApi] = queryKey;

  const result = await (iamServiceApi as AxiosInstance).get<
    HTTPResourceResponse<User>
  >(`${BASE_URL}/users/${id}`);

  return result.data;
}

export function useFetchUser({ id }: QueryDetailsProps) {
  const iamServiceApi = useApi(AppEnum.IAM);

  return useQuery([...userKeys.details(id), iamServiceApi], fetchUser);
}

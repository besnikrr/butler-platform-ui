import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  HubV2,
  HTTPResourceResponse,
  QueryDetailsProps,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi } from "@butlerhospitality/ui-sdk";
import { hubKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function fetchHub({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<HubV2>> {
  const [, , id, networkServiceApi] = queryKey;

  const result = await (networkServiceApi as AxiosInstance).get<
    HTTPResourceResponse<HubV2>
  >(`${BASE_URL}/hubs/${id}`);

  return result.data;
}

export function useFetchHub({ id }: QueryDetailsProps) {
  const networkServiceApi = useApi(AppEnum.NETWORK);

  return useQuery([...hubKeys.details(id), networkServiceApi], fetchHub);
}

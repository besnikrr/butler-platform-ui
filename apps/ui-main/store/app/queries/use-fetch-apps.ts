import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  QueryListProps,
  App,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi, AppContext } from "@butlerhospitality/ui-sdk";
import { useContext } from "react";
import { BASE_URL } from "../../../shared/constatns";
import { appKeys } from "../query-keys";

async function fetchApps({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<App[]>> {
  const [, , iamServiceApi] = queryKey;

  const result = await (iamServiceApi as AxiosInstance).get<
    HTTPResourceResponse<App[]>
  >(`${BASE_URL}/apps`);

  return result.data;
}

export function useFetchApps({ enabled = true }: QueryListProps) {
  const iamServiceApi = useApi(AppEnum.IAM);
  const { user } = useContext(AppContext);

  return useQuery([...appKeys.list(), iamServiceApi], fetchApps, {
    enabled: !!iamServiceApi && enabled && user.authenticated,
    notifyOnChangeProps: ["data"],
    select: (data) => {
      return data?.payload?.filter((app) => {
        if (!Object.keys(app.dashboard_settings).length) {
          return null;
        }

        return app;
      });
    },
  });
}

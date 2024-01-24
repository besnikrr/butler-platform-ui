import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  pushNotification,
  useTranslation,
} from "@butlerhospitality/ui-sdk";

import {
  AppEnum,
  CreateHub,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { hubKeys } from "../query-keys";
import { hotelKeys } from "../../hotel/query-keys";
import { BASE_URL } from "../../../shared/constants";

async function createHub(
  data: CreateHub,
  api: AxiosInstance
): Promise<HTTPResourceResponse<CreateHub>> {
  const networkServiceApi = api;
  const result = await networkServiceApi.post<HTTPResourceResponse<CreateHub>>(
    `${BASE_URL}/hubs`,
    data
  );
  return result.data;
}

export function useCreateHub() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const networkServiceApi = useApi(AppEnum.NETWORK);

  return useMutation((data: CreateHub) => createHub(data, networkServiceApi), {
    onError: () => {
      pushNotification(t("Hub create failed"), {
        type: "error",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(hubKeys.all);
      queryClient.invalidateQueries(hotelKeys.all);

      pushNotification(t("Hub created successfully"), {
        type: "success",
      });
    },
  });
}

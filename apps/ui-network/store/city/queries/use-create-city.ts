import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  pushNotification,
  useTranslation,
} from "@butlerhospitality/ui-sdk";

import {
  AppEnum,
  CityV2,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { cityKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function createCity(
  data: CityV2,
  api: AxiosInstance
): Promise<HTTPResourceResponse<CityV2>> {
  const networkServiceApi = api;
  const result = await networkServiceApi.post<HTTPResourceResponse<CityV2>>(
    `${BASE_URL}/cities`,
    data
  );
  return result.data;
}

export function useCreateCity() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const networkServiceApi = useApi(AppEnum.NETWORK);

  return useMutation((data: CityV2) => createCity(data, networkServiceApi), {
    onError: () => {
      pushNotification(t("City create failed"), {
        type: "error",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(cityKeys.all);
      pushNotification(t("City created successfully"), {
        type: "success",
      });
    },
  });
}

import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  CityV2,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { cityKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function updateCity(
  id: string,
  data: CityV2,
  api: AxiosInstance
): Promise<HTTPResourceResponse<CityV2>> {
  const networkServiceApi = api;
  const result = await networkServiceApi.patch<HTTPResourceResponse<CityV2>>(
    `${BASE_URL}/cities/${id}`,
    data
  );

  return result.data;
}

export function useUpdateCity(id: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const networkServiceApi = useApi(AppEnum.NETWORK);

  return useMutation(
    (data: CityV2) => updateCity(id, data, networkServiceApi),
    {
      onError: () => {
        pushNotification(t("City update failed"), {
          type: "error",
        });
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(cityKeys.all);
        pushNotification(t("City updated successfully"), {
          type: "success",
        });
      },
    }
  );
}

import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  UpdateHub,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { hubKeys } from "../query-keys";
import { hotelKeys } from "../../hotel/query-keys";
import { BASE_URL } from "../../../shared/constants";

async function updateHub(
  id: string,
  data: UpdateHub,
  api: AxiosInstance
): Promise<HTTPResourceResponse<UpdateHub>> {
  const networkServiceApi = api;
  const result = await networkServiceApi.patch<HTTPResourceResponse<UpdateHub>>(
    `${BASE_URL}/hubs/${id}`,
    data
  );

  return result.data;
}

export function useUpdateHub(id: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const networkServiceApi = useApi(AppEnum.NETWORK);

  return useMutation(
    (data: UpdateHub) => updateHub(id, data, networkServiceApi),
    {
      onError: () => {
        pushNotification(t("Hub update failed"), {
          type: "error",
        });
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(hubKeys.all);
        queryClient.invalidateQueries(hotelKeys.all);
        pushNotification(t("Hub updated successfully"), {
          type: "success",
        });
      },
    }
  );
}

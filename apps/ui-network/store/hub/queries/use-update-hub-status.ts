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
import { BASE_URL } from "../../../shared/constants";

async function updateHubStatus(
  id: string,
  data: UpdateHub,
  api: AxiosInstance
): Promise<HTTPResourceResponse<UpdateHub>> {
  const networkServiceApi = api;
  const result = await networkServiceApi.patch<HTTPResourceResponse<UpdateHub>>(
    `${BASE_URL}/hubs/status/${id}`,
    data
  );

  return result.data;
}

export function useUpdateHubStatus(id: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const networkServiceApi = useApi(AppEnum.NETWORK);

  return useMutation(
    (data: UpdateHub) => updateHubStatus(id, data, networkServiceApi),
    {
      onError: () => {
        pushNotification(t("Hub status update failed"), {
          type: "error",
        });
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(hubKeys.all);
        pushNotification(t("Hub status updated successfully"), {
          type: "success",
        });
      },
    }
  );
}

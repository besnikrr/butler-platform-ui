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

async function deleteHub(
  id: string | number,
  api: AxiosInstance
): Promise<HTTPResourceResponse<UpdateHub>> {
  const networkServiceApi = api;
  const result = await networkServiceApi.delete<
    HTTPResourceResponse<UpdateHub>
  >(`${BASE_URL}/hubs/${id}`);

  return result.data;
}

export function useDeleteHub(id: string | number) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const networkServiceApi = useApi(AppEnum.NETWORK);

  return useMutation(() => deleteHub(id, networkServiceApi), {
    onError: () => {
      pushNotification(t("Hub delete failed"), {
        type: "error",
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(hubKeys.all);
      queryClient.invalidateQueries(hotelKeys.all);

      pushNotification(t("Hub deleted successfully"), {
        type: "success",
      });
    },
  });
}

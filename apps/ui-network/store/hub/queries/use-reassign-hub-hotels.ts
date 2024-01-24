import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  HTTPResourceResponse,
  HubV2,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { hubKeys } from "../query-keys";
import { hotelKeys } from "../../hotel/query-keys";
import { BASE_URL } from "../../../shared/constants";

type FormStateT = { hotel_id?: string; hub_id: string; hub_name: string };

async function hubReassignHotels(
  id: string,
  data: FormStateT[],
  api: AxiosInstance
): Promise<HTTPResourceResponse<HubV2[]>> {
  const networkServiceApi = api;
  const result = await networkServiceApi.patch<HTTPResourceResponse<HubV2[]>>(
    `${BASE_URL}/hubs/reassign-hotels/${id}`,
    data
  );

  return result.data;
}

export function useHubReassignHotels(id: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const networkServiceApi = useApi(AppEnum.NETWORK);

  return useMutation(
    (data: FormStateT[]) => hubReassignHotels(id, data, networkServiceApi),
    {
      onError: () => {
        pushNotification(t("Hub status update failed"), {
          type: "error",
        });
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(hubKeys.all);
        queryClient.invalidateQueries(hotelKeys.all);

        pushNotification(t("Hub status updated successfully"), {
          type: "success",
        });
      },
    }
  );
}

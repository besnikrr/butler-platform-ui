import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  UpdateHotel,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { hotelKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";
import { hubKeys } from "../../hub/query-keys";

async function deleteHotel(
  id: string | number,
  api: AxiosInstance
): Promise<HTTPResourceResponse<UpdateHotel>> {
  const networkServiceApi = api;
  const result = await networkServiceApi.delete<
    HTTPResourceResponse<UpdateHotel>
  >(`${BASE_URL}/hotels/${id}`);

  return result.data;
}

export function useDeleteHotel(id: string | number) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const networkServiceApi = useApi(AppEnum.NETWORK);

  return useMutation(() => deleteHotel(id, networkServiceApi), {
    onError: () => {
      pushNotification(t("Hotel delete failed"), {
        type: "error",
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(hotelKeys.all);
      queryClient.invalidateQueries(hubKeys.all);

      pushNotification(t("Hotel deleted successfully"), {
        type: "success",
      });
    },
  });
}

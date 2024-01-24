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
import { hubKeys } from "../../hub/query-keys";
import { BASE_URL } from "../../../shared/constants";

async function updateHotel(
  id: string,
  data: UpdateHotel,
  api: AxiosInstance
): Promise<HTTPResourceResponse<UpdateHotel>> {
  const networkServiceApi = api;
  const result = await networkServiceApi.patch<
    HTTPResourceResponse<UpdateHotel>
  >(`${BASE_URL}/hotels/${id}`, data);

  return result.data;
}

export function useUpdateHotel(id: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const networkServiceApi = useApi(AppEnum.NETWORK);

  return useMutation(
    (data: UpdateHotel) => updateHotel(id, data, networkServiceApi),
    {
      onError: () => {
        pushNotification(t("Hotel update failed"), {
          type: "error",
        });
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(hotelKeys.all);
        queryClient.invalidateQueries(hubKeys.all);
        pushNotification(t("Hotel updated successfully"), {
          type: "success",
        });
      },
    }
  );
}

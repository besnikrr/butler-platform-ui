import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  pushNotification,
  useTranslation,
} from "@butlerhospitality/ui-sdk";

import {
  AppEnum,
  CreateHotel,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { hotelKeys } from "../query-keys";
import { hubKeys } from "../../hub/query-keys";
import { BASE_URL } from "../../../shared/constants";

async function createHotel(
  data: CreateHotel,
  api: AxiosInstance
): Promise<HTTPResourceResponse<CreateHotel>> {
  const networkServiceApi = api;
  const result = await networkServiceApi.post<
    HTTPResourceResponse<CreateHotel>
  >(`${BASE_URL}/hotels`, data);
  return result.data;
}

export function useCreateHotel() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const networkServiceApi = useApi(AppEnum.NETWORK);

  return useMutation(
    (data: CreateHotel) => createHotel(data, networkServiceApi),
    {
      onError: () => {
        pushNotification(t("Hotel create failed"), {
          type: "error",
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(hotelKeys.all);
        queryClient.invalidateQueries(hubKeys.all);
        pushNotification(t("Hotel created successfully"), {
          type: "success",
        });
      },
    }
  );
}

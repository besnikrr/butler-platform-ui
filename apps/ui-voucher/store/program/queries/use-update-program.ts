import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  Program,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { programKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function updateProgram(
  id: string,
  data: Program,
  api: AxiosInstance
): Promise<HTTPResourceResponse<Program>> {
  const voucherServiceApi = api;
  const result = await voucherServiceApi.put<HTTPResourceResponse<Program>>(
    `${BASE_URL}/programs/${id}`,
    data
  );

  return result.data;
}

export function useUpdateProgram(id: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const voucherServiceApi = useApi(AppEnum.VOUCHER);

  return useMutation(
    (data: Program) => updateProgram(id, data, voucherServiceApi),
    {
      onError: () => {
        pushNotification(t("Program update failed"), {
          type: "error",
        });
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(programKeys.all);
        pushNotification(t("Program updated successfully"), {
          type: "success",
        });
      },
    }
  );
}

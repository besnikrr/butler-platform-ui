import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  HTTPResourceResponse,
  Program,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { programKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

type FormStateT = { activate: boolean; ids: number[] | string[] };

async function updateProgramStatus(
  data: FormStateT,
  api: AxiosInstance
): Promise<HTTPResourceResponse<Program[]>> {
  const voucherServiceApi = api;
  const result = await voucherServiceApi.post<HTTPResourceResponse<Program[]>>(
    `${BASE_URL}/programs/batch-edit-status`,
    data
  );

  return result.data;
}

export function useUpdateProgramStatus() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const voucherServiceApi = useApi(AppEnum.VOUCHER);

  return useMutation(
    (data: FormStateT) => updateProgramStatus(data, voucherServiceApi),
    {
      onError: () => {
        pushNotification(t("Program status update failed"), {
          type: "error",
        });
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(programKeys.all);
        pushNotification(t("Program status updated successfully"), {
          type: "success",
        });
      },
    }
  );
}

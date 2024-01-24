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
import { hotelProgramKeys } from "../../hotel-program/query-keys";

async function createProgram(
  data: Program,
  api: AxiosInstance
): Promise<HTTPResourceResponse<Program>> {
  const voucherServiceApi = api;
  const result = await voucherServiceApi.post<HTTPResourceResponse<Program>>(
    `${BASE_URL}/programs`,
    data
  );

  return result.data;
}

export function useCreateProgram() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const voucherServiceApi = useApi(AppEnum.VOUCHER);

  return useMutation(
    (data: Program) => createProgram(data, voucherServiceApi),
    {
      onError: () => {
        pushNotification(t("Program create failed"), {
          type: "error",
        });
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(programKeys.all);
        queryClient.invalidateQueries(hotelProgramKeys.all);
        pushNotification(t("Program created successfully"), {
          type: "success",
        });
      },
    }
  );
}

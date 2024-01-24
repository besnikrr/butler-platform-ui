import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import { AppEnum, User, HTTPResourceResponse } from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { userKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function deleteUser(
  id: string | number,
  api: AxiosInstance
): Promise<HTTPResourceResponse<User>> {
  const iamServiceApi = api;
  const result = await iamServiceApi.delete<HTTPResourceResponse<User>>(
    `${BASE_URL}/users/${id}`
  );

  return result.data;
}

export function useDeleteUser(id: string | number) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const iamServiceApi = useApi(AppEnum.IAM);

  return useMutation(() => deleteUser(id, iamServiceApi), {
    onError: () => {
      pushNotification(t("User delete failed"), {
        type: "error",
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(userKeys.all);
      pushNotification(t("User deleted successfully"), {
        type: "success",
      });
    },
  });
}

import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import { AppEnum, HTTPResourceResponse, User } from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { userKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function updateUser(
  id: string,
  data: User,
  api: AxiosInstance
): Promise<HTTPResourceResponse<User>> {
  const result = await api.put<HTTPResourceResponse<User>>(
    `${BASE_URL}/users/${id}`,
    data
  );

  return result.data;
}

export function useUpdateUser(id: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const api = useApi(AppEnum.IAM);

  return useMutation((data: User) => updateUser(id, data, api), {
    onError: () => {
      pushNotification(t("User update failed"), {
        type: "error",
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(userKeys.all);
      queryClient.invalidateQueries("network-users");
      pushNotification(t("User updated successfully"), {
        type: "success",
      });
    },
  });
}

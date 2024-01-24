import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  pushNotification,
  useTranslation,
} from "@butlerhospitality/ui-sdk";

import { AppEnum, User, HTTPResourceResponse } from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { userKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function createUser(
  data: User,
  api: AxiosInstance
): Promise<HTTPResourceResponse<User>> {
  const iamServiceApi = api;
  const result = await iamServiceApi.post<HTTPResourceResponse<User>>(
    `${BASE_URL}/users`,
    data
  );
  return result.data;
}

export function useCreateUser() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const iamServiceApi = useApi(AppEnum.IAM);

  return useMutation((data: User) => createUser(data, iamServiceApi), {
    onError: () => {
      pushNotification(t("User create failed"), {
        type: "error",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(userKeys.all);
      queryClient.invalidateQueries("network-users");
      pushNotification(t("User created successfully"), {
        type: "success",
      });
    },
  });
}

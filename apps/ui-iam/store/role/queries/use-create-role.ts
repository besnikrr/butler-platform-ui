import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  pushNotification,
  useTranslation,
} from "@butlerhospitality/ui-sdk";

import { AppEnum, Role, HTTPResourceResponse } from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { roleKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function createRole(
  data: Role,
  api: AxiosInstance
): Promise<HTTPResourceResponse<Role>> {
  const result = await api.post<HTTPResourceResponse<Role>>(
    `${BASE_URL}/roles`,
    data
  );
  return result.data;
}

export function useCreateRole() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const api = useApi(AppEnum.IAM);

  return useMutation((data: Role) => createRole(data, api), {
    onError: () => {
      pushNotification(t("Role create failed"), {
        type: "error",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(roleKeys.all);
      pushNotification(t("Role created successfully"), {
        type: "success",
      });
    },
  });
}

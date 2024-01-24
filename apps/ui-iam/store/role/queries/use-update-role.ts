import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import { AppEnum, HTTPResourceResponse, Role } from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { roleKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function updateRole(
  id: string,
  data: Role,
  api: AxiosInstance
): Promise<HTTPResourceResponse<Role>> {
  const result = await api.put<HTTPResourceResponse<Role>>(
    `${BASE_URL}/roles/${id}`,
    data
  );

  return result.data;
}

export function useUpdateRole(id: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const api = useApi(AppEnum.IAM);

  return useMutation((data: Role) => updateRole(id, data, api), {
    onError: () => {
      pushNotification(t("Role update failed"), {
        type: "error",
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(roleKeys.all);
      pushNotification(t("Role updated successfully"), {
        type: "success",
      });
    },
  });
}

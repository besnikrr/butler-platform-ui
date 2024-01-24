import { useMutation, useQueryClient } from "react-query";
import { useApi, useTranslation, pushNotification } from "@butlerhospitality/ui-sdk";
import { AppEnum, Role, HTTPResourceResponse } from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { roleKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";
import { userKeys } from "../../user/query-keys";

async function deleteRole(id: string | number, api: AxiosInstance): Promise<HTTPResourceResponse<Role>> {
  const iamServiceApi = api;
  const result = await iamServiceApi.delete<HTTPResourceResponse<Role>>(`${BASE_URL}/roles/${id}`);

  return result.data;
}

export function useDeleteRole(id: string | number) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const iamServiceApi = useApi(AppEnum.IAM);

  return useMutation(() => deleteRole(id, iamServiceApi), {
    onError: () => {
      pushNotification(t("Role delete failed"), {
        type: "error",
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(roleKeys.all);
      queryClient.invalidateQueries(userKeys.all);
      pushNotification(t("Role deleted successfully"), {
        type: "success",
      });
    },
  });
}

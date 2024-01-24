import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  PermissionGroup,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { permissionGroupKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";
import { roleKeys } from "../../role/query-keys";
import { userKeys } from "../../user/query-keys";

async function deletePermissionGroup(
  id: string | number,
  api: AxiosInstance
): Promise<HTTPResourceResponse<PermissionGroup>> {
  const iamServiceApi = api;
  const result = await iamServiceApi.delete<
    HTTPResourceResponse<PermissionGroup>
  >(`${BASE_URL}/permissiongroups/${id}`);

  return result.data;
}

export function useDeletePermissionGroup(id: string | number) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const iamServiceApi = useApi(AppEnum.IAM);

  return useMutation(() => deletePermissionGroup(id, iamServiceApi), {
    onError: () => {
      pushNotification(t("Permission Group delete failed"), {
        type: "error",
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(permissionGroupKeys.all);
      queryClient.invalidateQueries(roleKeys.all);
      pushNotification(t("Permission Group deleted successfully"), {
        type: "success",
      });
    },
  });
}

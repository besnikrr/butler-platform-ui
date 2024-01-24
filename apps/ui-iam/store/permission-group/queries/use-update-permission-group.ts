import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  HTTPResourceResponse,
  PermissionGroup,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { permissionGroupKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function updatePermissionGroup(
  id: string,
  data: PermissionGroup,
  api: AxiosInstance
): Promise<HTTPResourceResponse<PermissionGroup>> {
  const result = await api.put<HTTPResourceResponse<PermissionGroup>>(
    `${BASE_URL}/permissiongroups/${id}`,
    data
  );

  return result.data;
}

export function useUpdatePermissionGroup(id: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const api = useApi(AppEnum.IAM);

  return useMutation(
    (data: PermissionGroup) => updatePermissionGroup(id, data, api),
    {
      onError: () => {
        pushNotification(t("Permission group update failed"), {
          type: "error",
        });
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(permissionGroupKeys.all);
        pushNotification(t("Permission group updated successfully"), {
          type: "success",
        });
      },
    }
  );
}

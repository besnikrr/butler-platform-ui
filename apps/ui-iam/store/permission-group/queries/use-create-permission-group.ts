import { useMutation, useQueryClient } from "react-query";
import {
  useApi,
  pushNotification,
  useTranslation,
} from "@butlerhospitality/ui-sdk";

import {
  AppEnum,
  PermissionGroup,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { permissionGroupKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function createPermissionGroup(
  data: PermissionGroup,
  api: AxiosInstance
): Promise<HTTPResourceResponse<PermissionGroup>> {
  const result = await api.post<HTTPResourceResponse<PermissionGroup>>(
    `${BASE_URL}/permissiongroups`,
    data
  );
  return result.data;
}

export function useCreatePermissionGroup() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const api = useApi(AppEnum.IAM);

  return useMutation(
    (data: PermissionGroup) => createPermissionGroup(data, api),
    {
      onError: () => {
        pushNotification(t("Permission group create failed"), {
          type: "error",
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(permissionGroupKeys.all);
        pushNotification(t("Permission group created successfully"), {
          type: "success",
        });
      },
    }
  );
}

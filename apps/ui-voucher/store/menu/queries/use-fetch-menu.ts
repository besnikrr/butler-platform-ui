import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  HTTPResourceResponse,
  QueryDetailsProps,
  VoucherMenu,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi } from "@butlerhospitality/ui-sdk";
import { voucherMenuKeys } from "../query-keys";
import { MENU_BASE_URL } from "../../../shared/constants";

async function fetchMenu({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<VoucherMenu>> {
  const [, , id, menuServiceApi] = queryKey;

  const result = await (menuServiceApi as AxiosInstance).get<
    HTTPResourceResponse<VoucherMenu>
  >(`${MENU_BASE_URL}/${id}?formatted=true`);

  return result.data;
}

export function useFetchMenu({ id, enabled = true }: QueryDetailsProps) {
  const menuServiceApi = useApi(AppEnum.MENU);

  return useQuery([...voucherMenuKeys.details(id), menuServiceApi], fetchMenu, {
    enabled,
  });
}

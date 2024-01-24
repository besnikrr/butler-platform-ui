import { AppEnum, ResourceResponse, Tenant } from "@butlerhospitality/shared";
import { createApi } from "../../api";

export async function getTenant(): Promise<ResourceResponse<Tenant>> {
  const tenantServiceApi = createApi(AppEnum.TENANT);
  const response = await tenantServiceApi.get<ResourceResponse<Tenant>>(
    "/current"
  );
  return response.data;
}

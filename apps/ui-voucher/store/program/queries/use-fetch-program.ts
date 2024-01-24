import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  Program,
  HTTPResourceResponse,
  QueryDetailsProps,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi } from "@butlerhospitality/ui-sdk";
import { programKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function fetchProgram({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<Program>> {
  const [, , id, voucherServiceApi] = queryKey;

  const result = await (voucherServiceApi as AxiosInstance).get<
    HTTPResourceResponse<Program>
  >(`${BASE_URL}/programs/${id}`);

  return result.data;
}

export function useFetchProgram({ id }: QueryDetailsProps) {
  const voucherServiceApi = useApi(AppEnum.VOUCHER);

  return useQuery(
    [...programKeys.details(id), voucherServiceApi],
    fetchProgram
  );
}

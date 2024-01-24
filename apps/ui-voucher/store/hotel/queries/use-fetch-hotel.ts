import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  VoucherHotel,
  HTTPResourceResponse,
  QueryDetailsProps,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi } from "@butlerhospitality/ui-sdk";
import { voucherHotelKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function fetchHotel({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<VoucherHotel>> {
  const [, , id, voucherServiceApi] = queryKey;

  const result = await (voucherServiceApi as AxiosInstance).get<
    HTTPResourceResponse<VoucherHotel>
  >(`${BASE_URL}/hotels/${id}`);

  return result.data;
}

export function useFetchHotel({ id }: QueryDetailsProps) {
  const voucherServiceApi = useApi(AppEnum.VOUCHER);

  return useQuery(
    [...voucherHotelKeys.details(id), voucherServiceApi],
    fetchHotel
  );
}

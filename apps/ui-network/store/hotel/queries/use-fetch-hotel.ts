import { useQuery, QueryKey } from "react-query";
import {
  AppEnum,
  HotelDetails,
  HTTPResourceResponse,
  QueryDetailsProps,
} from "@butlerhospitality/shared";
import { AxiosInstance } from "axios";
import { useApi } from "@butlerhospitality/ui-sdk";
import { hotelKeys } from "../query-keys";
import { BASE_URL } from "../../../shared/constants";

async function fetchHotel({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<HTTPResourceResponse<HotelDetails>> {
  const [, , id, networkServiceApi] = queryKey;

  const result = await (networkServiceApi as AxiosInstance).get<
    HTTPResourceResponse<HotelDetails>
  >(`${BASE_URL}/hotels/${id}`);

  return result.data;
}

export function useFetchHotel({ id }: QueryDetailsProps) {
  const networkServiceApi = useApi(AppEnum.NETWORK);

  return useQuery([...hotelKeys.details(id), networkServiceApi], fetchHotel);
}

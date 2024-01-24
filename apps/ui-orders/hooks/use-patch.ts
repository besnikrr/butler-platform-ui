import { useMutation, useQueryClient } from "react-query";
import { AppEnum, HTTPResourceResponse } from "@butlerhospitality/shared";
import { useApi } from "@butlerhospitality/ui-sdk";
import { AxiosInstance } from "axios";
import { BASE_URL } from "../shared/constants";

export type Config = {
  path: string;
  cacheKeys?: string[];
};

export function usePatch<T1, T2>(config: Config) {
  const queryClient = useQueryClient();
  const orderServiceApi = useApi(AppEnum.ORDER) as AxiosInstance;
  return useMutation(
    `${config.path}`,
    async (payload: T2) => {
      const result = await orderServiceApi.patch<HTTPResourceResponse<T1>>(`${BASE_URL}${config.path}`, payload);
      return result.data as T1;
    },
    {
      onSuccess: () => {
        config.cacheKeys?.forEach((key) => {
          queryClient.invalidateQueries(key);
        });
      },
    }
  );
}

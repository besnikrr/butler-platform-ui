import { useQuery } from "react-query";
import { AppEnum, HTTPResourceResponse } from "@butlerhospitality/shared";
import qs from "qs";
import { getUrl, useApi } from "@butlerhospitality/ui-sdk";

export type Config<T> = {
  path?: string;
  query?: T;
};

export type Options = {
  enabled?: boolean;
  retry?: boolean;
  cacheTime?: number;
};

export const useFetch = (app: AppEnum) => {
  const api = useApi(app);
  const baseUrl = getUrl(app);
  return <T1, T2 = void>(config: Config<T2>, options?: Options) => {
    const query = config.query ? qs.stringify(config.query) : "";
    const path = config.path ?? "";
    return useQuery(
      [path, query],
      async () => {
        const result = await api.get<HTTPResourceResponse<T1>>(`${baseUrl}${path}?${query}`);
        return result.data;
      },
      options
    );
  };
};

export enum Status {
  IDLE = "idle",
  ERROR = "error",
  LOADING = "loading",
  SUCCESS = "success",
}

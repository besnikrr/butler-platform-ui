import { useContext, useMemo } from "react";
import { AppEnum } from "@butlerhospitality/shared";
import axios, { AxiosInstance } from "axios";
import { AppContext } from "../context";
import { setupInterceptorsTo } from "./interceptors";

export function useApi(app: AppEnum) {
  const { tenant } = useContext(AppContext);
  const api: AxiosInstance = useMemo((): AxiosInstance => {
    return axios.create();
  }, []);

  setupInterceptorsTo(api, tenant, app);

  return api;
}

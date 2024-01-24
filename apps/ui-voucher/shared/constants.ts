import { AppEnum } from "@butlerhospitality/shared";
import { getUrl } from "@butlerhospitality/ui-sdk";

const PAGE_SIZE: number = 10;

const BASE_URL =
  process.env.NODE_ENV === "development" ? getUrl(AppEnum.VOUCHER) : "";

const MENU_BASE_URL =
  process.env.NODE_ENV === "development" ? getUrl(AppEnum.MENU) : "";

export { PAGE_SIZE, BASE_URL, MENU_BASE_URL };

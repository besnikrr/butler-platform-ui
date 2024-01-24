import { AppEnum } from "@butlerhospitality/shared";
import { getUrl } from "@butlerhospitality/ui-sdk";

const BASE_URL =
  process.env.NODE_ENV === "development" ? getUrl(AppEnum.IAM) : "";

export { BASE_URL };

import { useTranslation } from "react-i18next";
import "./index.scss";

export function GoToOMSLink({ path }: { path: string }) {
  const { t } = useTranslation();
  const generateOmsLink = (entityPath: string): string => {
    if (process.env.NX_STAGE === "production") {
      return `https://oms.butlerhospitality.com/#/${entityPath}`;
    }
    return `https://dev.oms.butlerhospitality.com/#/${entityPath}`;
  };

  return (
    <a
      className="ui-link ui-link-medium"
      target="_blank"
      href={generateOmsLink(path)}
      rel="noreferrer"
    >
      {t("Go to OMS")}
    </a>
  );
}

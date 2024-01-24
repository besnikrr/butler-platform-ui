import { Icon } from "../../component/icon";
import { Typography } from "../../component/typography";
import { useTranslation } from "../../package/localization";

interface NoResultProps {
  text?: string;
  helper?: string;
}

const NoResult = ({ text, helper }: NoResultProps) => {
  const { t } = useTranslation();
  return (
    <div className="ui-flex center py-40">
      <div className="ui-flex column v-center center">
        <Icon type="Search" size={30} className="mb-10" />
        <Typography h2>{text || t("table.data.no_data")}</Typography>
        {helper && (
          <Typography size="large" muted className="mt-20">
            {helper || t("table.data.no_data_found")}
          </Typography>
        )}
      </div>
    </div>
  );
};

NoResult.defaultProps = {
  text: "",
  helper: "",
};

export default NoResult;

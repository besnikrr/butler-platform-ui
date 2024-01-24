import {
  Card,
  Column,
  Link,
  Row,
  Typography,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { useHistory } from "react-router-dom";
import { HubGeneralInformationProp } from "../index.types";

const ExpeditorSettings = ({ hub }: HubGeneralInformationProp): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Row>
      <Column>
        <Card
          className="network-content"
          page
          header={
            <>
              <Typography h2>{t("Expeditor")}</Typography>
              <Link
                component="button"
                onClick={() =>
                  history.push(
                    `/network/hub/edit/expeditor-settings/${hub?.id}`
                  )
                }
              >
                {t("Edit")}
              </Link>
            </>
          }
        >
          <Row>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("Expeditor is")}
              </Typography>
              <Typography>
                {hub?.has_expeditor_app_enabled ? t("Enabled") : t("Disabled")}
              </Typography>
            </div>
          </Row>
        </Card>
      </Column>
    </Row>
  );
};

export default ExpeditorSettings;

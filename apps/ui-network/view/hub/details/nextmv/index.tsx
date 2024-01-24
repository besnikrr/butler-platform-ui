import React from "react";
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

export default function NextMvSettings({
  hub,
}: HubGeneralInformationProp): JSX.Element {
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
              <Typography h2>Next move</Typography>
              <Link
                component="button"
                onClick={() =>
                  history.push(`/network/hub/edit/next-mv-settings/${hub?.id}`)
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
                {t("Next Move")}
              </Typography>{" "}
              <Typography>
                {hub?.has_nextmv_enabled ? t("Enabled") : t("Disabled")}{" "}
              </Typography>
            </div>
          </Row>
        </Card>
      </Column>
    </Row>
  );
}

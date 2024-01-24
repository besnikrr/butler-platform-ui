import { useContext } from "react";
import {
  AppContext,
  Card,
  Column,
  Link,
  Row,
  Typography,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { useHistory } from "react-router-dom";
import { PERMISSION } from "@butlerhospitality/shared";
import { HotelGeneralInformationProp } from "../index.types";

export default function Activities({ hotel }: HotelGeneralInformationProp) {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const history = useHistory();

  const canEditActivities = can(
    PERMISSION.NETWORK.CAN_UPDATE_HOTEL_INTEGRATION_CONFIGS_ACTIVITIES
  );

  return (
    <Row>
      <Column>
        <Card
          className="network-content"
          page
          header={
            <>
              <Typography h2>{t("Activities")}</Typography>
              {hotel?.id && canEditActivities && (
                <Link
                  component="button"
                  onClick={() =>
                    history.push(`/network/hotel/edit/activities/${hotel?.id}`)
                  }
                >
                  {t("Edit")}
                </Link>
              )}
            </>
          }
        >
          <Row>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("Activities are")}
              </Typography>{" "}
              <Typography>
                {hotel?.has_activities_enabled ? t("Enabled") : t("Disabled")}{" "}
              </Typography>
            </div>
          </Row>
        </Card>
      </Column>
    </Row>
  );
}

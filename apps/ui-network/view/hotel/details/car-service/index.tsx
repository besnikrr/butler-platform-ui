import { useContext } from "react";
import {
  Card,
  Column,
  Link,
  Row,
  Typography,
  useTranslation,
  AppContext,
} from "@butlerhospitality/ui-sdk";
import { useHistory } from "react-router-dom";
import { PERMISSION } from "@butlerhospitality/shared";
import { HotelGeneralInformationProp } from "../index.types";

export default function CarService({ hotel }: HotelGeneralInformationProp) {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const canEditCarService = can(
    PERMISSION.NETWORK.CAN_UPDATE_HOTEL_INTEGRATION_CONFIGS_CAR_SERVICE
  );
  const history = useHistory();

  return (
    <Row>
      <Column>
        <Card
          className="network-content"
          page
          header={
            <>
              <Typography h2>{t("Car Service")}</Typography>
              {canEditCarService && (
                <Link
                  component="button"
                  onClick={() =>
                    history.push(`/network/hotel/edit/shuttle-app/${hotel?.id}`)
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
                {t("Car Service is")}
              </Typography>{" "}
              <Typography>
                {hotel?.has_car_service_enabled ? t("Enabled") : t("Disabled")}{" "}
              </Typography>
            </div>
          </Row>
        </Card>
      </Column>
    </Row>
  );
}

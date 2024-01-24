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

export default function ServiceFee({ hotel }: HotelGeneralInformationProp) {
  const { t } = useTranslation();
  const history = useHistory();
  const { can } = useContext(AppContext);
  const canEditVouchers = can(
    PERMISSION.NETWORK.CAN_UPDATE_HOTEL_INTEGRATION_CONFIGS_VOUCHERS
  );

  return (
    <Row>
      <Column>
        <Card
          className="network-content"
          page
          header={
            <>
              <Typography h2>{t("service_fee")}</Typography>
              {canEditVouchers && hotel?.id && (
                <Link
                  component="button"
                  onClick={() =>
                    history.push(`/network/hotel/edit/service-fee/${hotel?.id}`)
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
                {t("service_fee")}
              </Typography>
              <Typography>
                {hotel?.service_fee?.[0]?.fee_type
                  ? t(`${hotel?.service_fee?.[0].fee_type}`)
                  : t("Disabled")}
              </Typography>
            </div>
          </Row>
        </Card>
      </Column>
    </Row>
  );
}

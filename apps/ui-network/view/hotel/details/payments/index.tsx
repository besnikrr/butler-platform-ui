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

export default function Payments({ hotel }: HotelGeneralInformationProp) {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const history = useHistory();
  const canEditPayment = can(PERMISSION.NETWORK.CAN_UPDATE_HOTEL_PAYMENTS);

  return (
    <Row>
      <Column>
        <Card
          className="network-content"
          page
          header={
            <>
              <Typography h2>{t("Payments")}</Typography>
              {canEditPayment && (
                <Link
                  component="button"
                  onClick={() =>
                    history.push(
                      `/network/hotel/edit/payment-settings/${hotel?.id}`
                    )
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
                {t("Credit Cards")}
              </Typography>{" "}
              <Typography data-testid="payment-allow-credit-card">
                {hotel?.allow_payment_credit_card ? t("Yes") : t("No")}
              </Typography>
            </div>
          </Row>

          <Row>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("Room Charge")}
              </Typography>{" "}
              <Typography data-testid="payment-allow-room-charge">
                {hotel?.allow_payment_room_charge ? t("Yes") : t("No")}
              </Typography>
            </div>
          </Row>
          <Row>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("Tax Exempt")}
              </Typography>
              <Typography data-testid="payment-allow-room-charge">
                {hotel?.is_tax_exempt ? t("Yes") : t("No")}
              </Typography>
            </div>
          </Row>
        </Card>
      </Column>
    </Row>
  );
}

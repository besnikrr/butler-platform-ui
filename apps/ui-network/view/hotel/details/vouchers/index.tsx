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

export default function Vouchers({ hotel }: HotelGeneralInformationProp) {
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
              <Typography h2>{t("Vouchers")}</Typography>

              {canEditVouchers && hotel?.id && (
                <Link
                  component="button"
                  onClick={() =>
                    history.push(`/network/hotel/edit/vouchers/${hotel?.id}`)
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
                {t("Vouchers")}
              </Typography>{" "}
              <Typography>
                {hotel?.has_vouchers_enabled ? t("Enabled") : t("Disabled")}{" "}
              </Typography>
            </div>
          </Row>
        </Card>
      </Column>
    </Row>
  );
}

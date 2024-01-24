import React, { useContext } from "react";
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

function Menu({ hotel }: HotelGeneralInformationProp): JSX.Element {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const history = useHistory();
  const canEditMenu = can(PERMISSION.NETWORK.CAN_UPDATE_HOTEL_MENU);

  return (
    <Row>
      <Column>
        <Card
          className="network-content"
          page
          header={
            <>
              <Typography h2>{t("Menu")}</Typography>
              {canEditMenu && (
                <Link
                  component="button"
                  onClick={() =>
                    history.push(`/network/hotel/edit/menu/${hotel?.id}`)
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
                {t("Make Hotel Visible to Guest View")}
              </Typography>
              <Typography data-testid="menu-app-enabled">
                {hotel?.web_active ? t("Yes") : t("No")}
              </Typography>
            </div>
          </Row>
          <Row>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("Web Phone")}
              </Typography>
              <Typography>{hotel?.web_phone}</Typography>
            </div>
          </Row>
          <Row>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("Scheduled Orders")}
              </Typography>
              <Typography data-testid="scheduled-orders-enabled">
                {hotel?.allow_scheduled_orders ? t("Yes") : t("No")}
              </Typography>
            </div>
          </Row>
          <Row>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("Delivery Notes")}
              </Typography>
              <Typography>{hotel?.delivery_instructions}</Typography>
            </div>
          </Row>
        </Card>
      </Column>
    </Row>
  );
}

export default Menu;

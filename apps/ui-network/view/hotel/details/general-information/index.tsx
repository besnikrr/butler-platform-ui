import { useContext } from "react";
import {
  Card,
  Column,
  Link,
  Row,
  Typography,
  Divider,
  useTranslation,
  AppContext,
  Chip,
  GoToOMSLink,
} from "@butlerhospitality/ui-sdk";
import { PERMISSION } from "@butlerhospitality/shared";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { HotelGeneralInformationProp } from "../index.types";
import Address from "../../../../component/address";
import { useFetchUsers } from "../../../../store/user";

export default function GeneralInformation({
  hotel,
}: HotelGeneralInformationProp) {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const history = useHistory();
  const editButtonVisible = can(PERMISSION.NETWORK.CAN_UPDATE_HOTEL);

  const { data: users } = useFetchUsers({});

  const getUserNameIAM = (): any => {
    const accountManager = (users?.payload || []).find(
      (item) => item.id === hotel?.account_manager_id
    );

    if (!accountManager) {
      return null;
    }

    return (
      <Typography value={accountManager?.id} key={accountManager.id}>
        {accountManager?.name}
      </Typography>
    );
  };

  const renderEmailContacts = (invoiceEmails: string) => {
    if (!invoiceEmails) {
      return null;
    }
    const invoiceEmailsArray = invoiceEmails.split(",");
    return invoiceEmailsArray.map((email) => (
      <Chip className="mr-5 mb-5" key={email}>
        {email}
      </Chip>
    ));
  };

  return (
    <Row>
      <Column>
        <Card
          className="network-content"
          page
          header={
            <>
              <Typography h2>{t("General Information")}</Typography>
              {editButtonVisible && (
                <Link
                  component="button"
                  onClick={() =>
                    history.push(
                      `/network/hotel/edit/general-information/${hotel?.id}`
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
              {hotel?.name && (
                <Row>
                  <div className="ui-flex between v-start">
                    <div className="ui-flex column">
                      <Typography size="small" muted className="pb-10">
                        {t("Hotel Name")}
                      </Typography>
                      <Typography className="pb-10">{hotel?.name}</Typography>
                    </div>
                    {hotel?.oms_id && (
                      <GoToOMSLink path={`hotels/${hotel.oms_id}/edit`} />
                    )}
                  </div>
                </Row>
              )}
              {hotel?.formal_name && (
                <Row>
                  <div className="ui-flex column">
                    <Typography size="small" muted className="pb-10">
                      {t("Hotel Formal Name")}
                    </Typography>
                    <Typography>{hotel?.formal_name}</Typography>
                  </div>
                </Row>
              )}
            </div>
          </Row>
          {(hotel?.address_town ||
            hotel?.address_number ||
            hotel?.address_street ||
            hotel?.address_zip_code) && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Address")}
                </Typography>
                <Address {...hotel} />
              </div>
            </Row>
          )}
          {hotel?.room_count && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Room Number Count")}
                </Typography>
                <Typography>{hotel?.room_count}</Typography>
              </div>
            </Row>
          )}
          <Row>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("PMS")}
              </Typography>
              <Typography>
                {hotel?.has_pms_enabled ? t("Enabled") : t("Disabled")}
              </Typography>
            </div>
          </Row>
          {hotel?.phone_number && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("phone_number")}
                </Typography>
                <Typography>{hotel?.phone_number}</Typography>
              </div>
            </Row>
          )}
          {hotel?.code && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Hotel Code")}
                </Typography>
                <Typography>{hotel?.code}</Typography>
              </div>
            </Row>
          )}
          {hotel?.web_code && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Hotel Web Code")}
                </Typography>
                <Typography>{hotel?.web_code}</Typography>
              </div>
            </Row>
          )}
          {hotel?.hub?.name && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Hub")}
                </Typography>
                <Link
                  size="medium"
                  component={RouterLink}
                  to={`/network/hub/view/${hotel.hub.id}`}
                >
                  {hotel?.hub?.name || "n/a"}
                </Link>
              </div>
            </Row>
          )}
          <Divider />
          <Typography h2>{t("Contact Information")}</Typography>
          {hotel?.account_manager_id && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Customer Success Manager")}
                </Typography>
                {getUserNameIAM()}
              </div>
            </Row>
          )}
          {hotel?.contact_person && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Contact Person")}
                </Typography>
                <Typography>{hotel?.contact_person}</Typography>
              </div>
            </Row>
          )}
          {hotel?.web_phone && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Hotel Contact Number")}
                </Typography>
                <Typography>{hotel?.web_phone}</Typography>
              </div>
            </Row>
          )}
          {hotel?.contact_email && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Invoice Email Address(es)")}
                </Typography>
                <div>{renderEmailContacts(hotel?.contact_email)}</div>
              </div>
            </Row>
          )}

          {hotel?.web_url_id && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Web URL ID")}
                </Typography>
                <Typography>{hotel?.web_url_id}</Typography>
              </div>
            </Row>
          )}
          {hotel?.delivery_instructions && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Delivery Instructions")}
                </Typography>
                <Typography>{hotel?.delivery_instructions}</Typography>
              </div>
            </Row>
          )}
          {(hotel?.address_coordinates?.x ||
            hotel?.address_coordinates?.latitude ||
            hotel?.address_coordinates?.longitude ||
            hotel?.address_coordinates?.y) && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("GPS Coordinates")}
                </Typography>
                <div className="ui-flex column">
                  <div className="ui-flex v-center">
                    <Typography p className="text-medium">
                      {t("Latitude")}
                    </Typography>
                    <Typography className="ml-5 text-medium" p>
                      {hotel?.address_coordinates?.x ||
                        hotel?.address_coordinates?.latitude ||
                        "n/a"}
                    </Typography>
                  </div>
                  <div className="ui-flex v-center">
                    <Typography p className="text-medium">
                      {t("Longitude")}
                    </Typography>
                    <Typography className="ml-5 text-medium" p>
                      {hotel?.address_coordinates?.y ||
                        hotel?.address_coordinates?.longitude ||
                        "n/a"}
                    </Typography>
                  </div>
                </div>
              </div>
            </Row>
          )}
        </Card>
      </Column>
    </Row>
  );
}

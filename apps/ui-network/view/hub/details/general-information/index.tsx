import {
  Card,
  Column,
  Link,
  Row,
  Typography,
  useTranslation,
  GoToOMSLink,
} from "@butlerhospitality/ui-sdk";

import { useHistory, Link as RouterLink } from "react-router-dom";
import { HubGeneralInformationProp } from "../index.types";
import AddressRenderer from "../../../../component/address";

export default function GeneralInformation({ hub }: HubGeneralInformationProp) {
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
              <Typography h2>General Information</Typography>
              <Link
                component="button"
                onClick={() => history.push(`/network/hub/edit/${hub?.id}`)}
              >
                {t("Edit")}
              </Link>
            </>
          }
        >
          {hub?.name && (
            <Row>
              <div className="ui-flex between v-start">
                <div className="ui-flex column">
                  <Typography size="small" muted className="pb-10">
                    {t("Hub Name")}
                  </Typography>
                  <Typography>{hub?.name}</Typography>
                </div>
                {hub?.oms_id && (
                  <GoToOMSLink path={`locations/${hub.oms_id}/edit`} />
                )}
              </div>
            </Row>
          )}

          {hub?.contact_email && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Contact Email")}
                </Typography>
                <Typography>{hub.contact_email}</Typography>
              </div>
            </Row>
          )}

          {hub?.contact_phone && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Contact Number")}
                </Typography>
                <Typography>{hub?.contact_phone}</Typography>
              </div>
            </Row>
          )}

          {(hub?.address_town ||
            hub?.address_number ||
            hub?.address_street ||
            hub?.address_zip_code) && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Address")}
                </Typography>
                <AddressRenderer
                  address_town={hub?.address_town}
                  address_street={hub?.address_street}
                  address_number={hub?.address_number}
                  address_zip_code={hub?.address_zip_code}
                />
              </div>
            </Row>
          )}

          {hub?.city && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Hub City")}
                </Typography>
                <Link
                  size="medium"
                  component={RouterLink}
                  to={`/network/city/view/${hub?.city?.id}`}
                >
                  {hub?.city?.name || "n/a"}
                </Link>
              </div>
            </Row>
          )}
          {hub?.address_zip_code && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("ZIP Code")}
                </Typography>
                <Typography>{hub?.address_zip_code}</Typography>
              </div>
            </Row>
          )}
          <Row>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("GPS Coordinates")}
              </Typography>
              <div className="ui-flex column">
                <div className="ui-flex v-center">
                  <Typography p className="text-medium">
                    Latitude:
                  </Typography>
                  <Typography className="ml-5 text-medium" p>
                    {hub?.address_coordinates?.x ||
                      hub?.address_coordinates?.latitude ||
                      "n/a"}
                  </Typography>
                </div>
                <div className="ui-flex v-center">
                  <Typography p className="text-medium">
                    Longitude:
                  </Typography>
                  <Typography className="ml-5 text-medium" p>
                    {hub?.address_coordinates?.y ||
                      hub?.address_coordinates?.longitude ||
                      "n/a"}
                  </Typography>
                </div>
              </div>
            </div>
          </Row>
          <Row>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("Hub Tax Rate %")}
              </Typography>
              <Typography>{hub?.tax_rate && `${hub?.tax_rate} %`}</Typography>
            </div>
          </Row>
        </Card>
      </Column>
    </Row>
  );
}

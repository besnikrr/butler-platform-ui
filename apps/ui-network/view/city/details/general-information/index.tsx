import { useContext } from "react";
import {
  Card,
  Column,
  Link,
  Row,
  Typography,
  AppContext,
  useTranslation,
  GoToOMSLink,
} from "@butlerhospitality/ui-sdk";
import { useHistory } from "react-router-dom";
import { PERMISSION } from "@butlerhospitality/shared";
import { CityGeneralInformationProp } from "../index.types";

export default function GeneralInformation({
  city,
}: CityGeneralInformationProp) {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const history = useHistory();
  const canUpdateCity = can(PERMISSION.NETWORK.CAN_UPDATE_CITY);

  return (
    <Row>
      <Column>
        <Card
          className="network-content"
          page
          header={
            <>
              <Typography h2>{t("General Information")}</Typography>
              {canUpdateCity && (
                <Link
                  component="button"
                  onClick={() => history.push(`/network/city/edit/${city?.id}`)}
                >
                  Edit
                </Link>
              )}
            </>
          }
        >
          {city?.name && (
            <Row>
              <div className="ui-flex between v-start">
                <div className="ui-flex column">
                  <Typography size="small" muted className="pb-10">
                    {t("City Name")}
                  </Typography>
                  <Typography>{city?.name}</Typography>
                </div>
                {city?.oms_id && (
                  <GoToOMSLink path={`cities/${city.oms_id}/edit`} />
                )}
              </div>
            </Row>
          )}
          {city?.state && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("State")}
                </Typography>
                <Typography>{city?.state}</Typography>
              </div>
            </Row>
          )}
          {city?.time_zone && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("Time Zone")}
                </Typography>
                <Typography>{city?.time_zone}</Typography>
              </div>
            </Row>
          )}
        </Card>
      </Column>
    </Row>
  );
}

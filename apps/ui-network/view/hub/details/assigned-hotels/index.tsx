import React from "react";
import {
  ActionButton,
  Badge,
  Card,
  Column,
  Icon,
  Row,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { HotelV2 } from "@butlerhospitality/shared";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { HubGeneralInformationProp } from "../index.types";
import NoResult from "../../../../component/NoResult";

const AssignedHotels: React.FC<HubGeneralInformationProp> = ({
  hub,
}): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Row>
      <Column>
        <Card
          page
          className="network-content"
          header={<Typography h2>{t("Assigned Hotels")}</Typography>}
        >
          <Typography p muted className="pb-30">
            {t("hub_manage.assigned_hotels.helper_text")}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th" />
                <TableCell as="th">{t("Hotel Name")}</TableCell>
                <TableCell as="th">{t("Status")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(hub?.hotels || []).map((hotel: HotelV2) => (
                <TableRow key={hotel.id}>
                  <TableCell className="act" style={{ width: "16px" }}>
                    <ActionButton
                      onClick={() => {
                        history.push(`/network/hotel/view/${hotel?.id}`);
                      }}
                    >
                      <Icon type="NewWindow" size={16} />
                    </ActionButton>
                  </TableCell>
                  <TableCell>{hotel?.name}</TableCell>
                  <TableCell>
                    <Badge
                      leftIcon="Circle"
                      iconSize={5}
                      size="small"
                      className={classNames({
                        "network-inactive-badge": !hotel.active,
                      })}
                    >
                      {hotel?.active ? t("Active") : t("Inactive")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {(!hub?.hotels || hub?.hotels.length < 1) && (
            <div>
              <NoResult />
            </div>
          )}
        </Card>
      </Column>
    </Row>
  );
};

export default AssignedHotels;

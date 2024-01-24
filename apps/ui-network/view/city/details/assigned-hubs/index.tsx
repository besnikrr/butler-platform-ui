import {
  ActionButton,
  Badge,
  Card,
  Column,
  Icon,
  Pagination,
  pushNotification,
  Row,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { getTotalPages, HubV2 } from "@butlerhospitality/shared";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { useState } from "react";
import NoResult from "../../../../component/NoResult";
import { useFetchHubs } from "../../../../store/hub";

export default function AssignedHubs({ cityId }: any) {
  const { t } = useTranslation();
  const history = useHistory();
  const [page, setPage] = useState<number>(1);

  const {
    data: hubData,
    isLoading: hubsLoading,
    isError: hubsError,
  } = useFetchHubs({
    page,
    filters: `city_ids[0]=${cityId}`,
  });

  if (hubsError) {
    pushNotification(t("Error fetching entity", { entity: "hubs" }), {
      type: "error",
    });

    return null;
  }

  return (
    <Row>
      <Column>
        <Card
          page
          className="network-content"
          header={<Typography h2>{t("Assigned Hubs")}</Typography>}
        >
          {hubsLoading ? (
            <Skeleton parts={["table"]} />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell as="th" />
                  <TableCell as="th">{t("Hub Name")}</TableCell>
                  <TableCell as="th">{t("Hotels Associated")}</TableCell>
                  <TableCell as="th">{t("Status")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(hubData?.payload || []).map((hub: HubV2) => (
                  <TableRow key={hub.id}>
                    <TableCell className="act" style={{ width: "16px" }}>
                      <ActionButton
                        onClick={() => {
                          history.push(`/network/hub/view/${hub?.id}`);
                        }}
                      >
                        <Icon type="NewWindow" size={16} />
                      </ActionButton>
                    </TableCell>
                    <TableCell>{hub?.name}</TableCell>
                    <TableCell>{hub?.hotels?.length}</TableCell>
                    <TableCell>
                      <Badge
                        leftIcon="Circle"
                        iconSize={5}
                        size="small"
                        className={classNames({
                          "network-inactive-badge": !hub.active,
                        })}
                      >
                        {hub?.active ? t("Active") : t("Inactive")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {(!hubData || (hubData.payload || []).length < 1) && !hubsLoading ? (
            <div>
              <NoResult />
            </div>
          ) : (
            <Pagination
              className="ui-flex end mt-20"
              pages={getTotalPages(Number(hubData?.total))}
              current={page}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </Card>
      </Column>
    </Row>
  );
}

import { useContext } from "react";
import {
  Grid,
  Typography,
  Skeleton,
  Card,
  Badge,
  useTranslation,
  AppContext,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import { useParams } from "react-router-dom";
import { PERMISSION } from "@butlerhospitality/shared";

import classNames from "classnames";
import GeneralInformation from "./general-information";
import AssignedHotels from "./assigned-hotels";
import NextMvSettings from "./nextmv";
import HubStatus from "./hub-actions";
import ExpeditorSettings from "./expeditor-settings";
import { useFetchHub } from "../../../store/hub";

export default function HubManage() {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const params = useParams<{ id: string }>();
  const canGetAssignedHotels = can(PERMISSION.NETWORK.CAN_GET_HOTELS);
  const { data, isLoading, isError } = useFetchHub({
    id: params.id,
    enabled: !!params.id,
  });

  if (isLoading) {
    return (
      <Grid gutter={0}>
        <Skeleton className="ml-10" parts={["header"]} />
        <Card>
          <Skeleton parts={["cardHeaderAction", "divider", "labelField-7"]} />
        </Card>
        <br />
        <Card>
          <Skeleton parts={["title", "divider", "filterTable"]} />
        </Card>
        <br />
        <Card>
          <Skeleton parts={["cardHeaderAction", "divider", "text-2"]} />
        </Card>
        <br />
        <Card>
          <Skeleton parts={["cardHeaderAction", "divider", "text-2"]} />
        </Card>
      </Grid>
    );
  }

  if (isError) {
    pushNotification(t("Error fetching", { entity: "hub" }), {
      type: "error",
    });

    return null;
  }

  return (
    <Grid gutter={0}>
      <div className="ui-flex between v-center mb-30 pl-30 py-10">
        <div className="ui-flex v-center">
          <Typography h2>{data?.payload?.name}</Typography>
          <Badge
            leftIcon="Circle"
            iconSize={5}
            size="small"
            className={classNames(
              { "network-inactive-badge": !data?.payload?.active },
              "ml-30"
            )}
          >
            {data?.payload?.active ? t("Active") : t("Inactive")}
          </Badge>
        </div>
        <HubStatus hub={data?.payload} onChange={undefined} />
      </div>
      <GeneralInformation hub={data && data.payload} />
      {canGetAssignedHotels && <AssignedHotels hub={data && data.payload} />}
      <NextMvSettings hub={data && data.payload} />
      <ExpeditorSettings hub={data && data.payload} />
    </Grid>
  );
}

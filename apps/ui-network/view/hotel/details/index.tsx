import {
  Grid,
  Typography,
  Skeleton,
  Card,
  Badge,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import { useParams } from "react-router-dom";

import classNames from "classnames";
import GeneralInformation from "./general-information";
import CarService from "./car-service";
import Activities from "./activities";
import HotelStatus from "./hotel-actions";
import Payments from "./payments";
import Vouchers from "./vouchers";
import Menu from "./menu";
import { useFetchHotel } from "../../../store/hotel";
import ServiceFee from "./service-fee";

export default function HotelManage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useFetchHotel({ id });

  if (isLoading) {
    return (
      <Grid gutter={0}>
        <Skeleton className="ml-10" parts={["header"]} />
        <Card>
          <Skeleton
            parts={[
              "cardHeaderAction",
              "divider",
              "text-2",
              "labelField-7",
              "divider",
              "text-2",
              "labelField-5",
            ]}
          />
        </Card>
        <br />
        <Card>
          <Skeleton
            parts={["cardHeaderAction", "divider", "text-2", "labelField-2"]}
          />
        </Card>
        <br />
        <Card>
          <Skeleton
            parts={["cardHeaderAction", "divider", "text-2", "labelField"]}
          />
        </Card>
        <br />
        <Card>
          <Skeleton
            parts={["cardHeaderAction", "divider", "text-2", "labelField"]}
          />
        </Card>
        <br />
        <Card>
          <Skeleton
            parts={["cardHeaderAction", "divider", "text-2", "labelField"]}
          />
        </Card>
        <br />
        <Card>
          <Skeleton
            parts={["cardHeaderAction", "divider", "text-2", "labelField"]}
          />
        </Card>
      </Grid>
    );
  }

  if (isError) {
    pushNotification(t("Error fetching", { entity: "hotel" }), {
      type: "error",
    });

    return null;
  }

  return (
    <Grid gutter={0}>
      <div className="ui-flex between v-center mb-30 pl-30">
        <div className="ui-flex">
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
        <HotelStatus hotel={data && data.payload} onChange={refetch} />
      </div>
      <GeneralInformation hotel={data && data.payload} />
      <Payments hotel={data && data.payload} />
      <Menu hotel={data && data.payload} />
      <ServiceFee hotel={data && data.payload} />
      <Vouchers hotel={data && data.payload} />
      <CarService hotel={data && data.payload} />
      <Activities hotel={data && data.payload} />
    </Grid>
  );
}

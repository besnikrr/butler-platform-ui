import {
  Grid,
  Typography,
  Skeleton,
  Card,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import { useParams } from "react-router-dom";
import { useFetchCity } from "../../../store/city";
import GeneralInformation from "./general-information";
import AssignedHubs from "./assigned-hubs";

export default function CityManage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useFetchCity({ id });

  if (isLoading) {
    return (
      <Grid gutter={0}>
        <div className="ml-30">
          <Skeleton parts={["title"]} />
        </div>
        <br />
        <Card>
          <Skeleton parts={["cardHeaderAction", "divider", "labelField-3"]} />
        </Card>
      </Grid>
    );
  }

  if (isError) {
    pushNotification("Error fetching city", {
      type: "error",
    });

    return null;
  }

  return (
    <Grid gutter={0}>
      <div className="ui-flex between v-center mb-30 pl-30">
        <Typography h2>{data?.payload?.name}</Typography>
      </div>
      <GeneralInformation city={data && data.payload} />
      <AssignedHubs cityId={data && data.payload && data.payload.id} />
    </Grid>
  );
}

import { useContext } from "react";
import {
  Grid,
  Skeleton,
  AppContext,
  Typography,
  Badge,
  useTranslation,
  pushNotification,
  Card,
} from "@butlerhospitality/ui-sdk";
import { useParams } from "react-router-dom";
import { PERMISSION, ProgramStatus } from "@butlerhospitality/shared";
import GeneralDetails from "./general";
import ConfigDetails from "./configs";
import NoPermissions from "../../../component/NoPermissions";
import VoucherProgramStatus from "./program-actions/index";
import { useFetchProgram } from "../../../store/program";

function ProgramDetails() {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const params = useParams<{ id: string }>();
  const canGetSingleVoucher =
    can && can(PERMISSION.VOUCHER.CAN_GET_SINGLE_VOUCHER_PROGRAM);

  const {
    data: programData,
    isError: isProgramError,
    isLoading: isProgramLoading,
    refetch: refetchProgram,
  } = useFetchProgram({
    id: params.id,
  });

  if (!canGetSingleVoucher) {
    return <NoPermissions entity="Voucher program" />;
  }

  if (isProgramLoading) {
    return (
      <Grid gutter={0}>
        <Skeleton className="ml-10" parts={["header"]} />
        <Card>
          <Skeleton
            parts={["cardHeaderAction", "divider", "text-2", "labelField-2"]}
          />
        </Card>
        <Card>
          <Skeleton parts={["text-2", "labelField-2"]} />
        </Card>
      </Grid>
    );
  }

  if (isProgramError) {
    pushNotification(t("Error fetching entity", { entity: "program" }), {
      type: "error",
    });
    return null;
  }

  return (
    <Grid gutter={0}>
      <div className="ui-flex between v-center mb-30 pl-30 py-10">
        <div className="ui-flex v-center">
          <Typography h2>{programData?.payload?.name}</Typography>
          <Badge
            leftIcon="Circle"
            iconSize={5}
            size="small"
            className={
              programData?.payload?.status === ProgramStatus.ACTIVE
                ? "ui-badge ml-30"
                : "ui-badge-inactive ml-30"
            }
          >
            {programData?.payload?.status === ProgramStatus.ACTIVE
              ? t("Active")
              : t("Inactive")}
          </Badge>
        </div>
        <VoucherProgramStatus
          program={programData?.payload}
          onChange={refetchProgram}
        />
      </div>
      <GeneralDetails voucherProgram={programData && programData?.payload} />
      <ConfigDetails voucherProgram={programData && programData?.payload} />
    </Grid>
  );
}

export default ProgramDetails;

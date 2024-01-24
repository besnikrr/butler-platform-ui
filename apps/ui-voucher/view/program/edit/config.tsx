import {
  Grid,
  Skeleton,
  Card,
  Typography,
  Row,
  Column,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import { useParams } from "react-router-dom";
import { Program, VoucherType } from "@butlerhospitality/shared";
import DiscountFormView from "./config-discount";
import PerDiemFormView from "./config-per-diem";
import PreFixeFormView from "./config-pre-fixe";
import { useFetchProgram } from "../../../store/program";

function VoucherEdit() {
  const { t } = useTranslation();
  const params = useParams<{ id: string; type: string }>();

  const {
    data: programData,
    isError: isProgramError,
    isLoading: isProgramLoading,
  } = useFetchProgram({
    id: params.id,
  });

  const renderEditViewByType = (type: string) => {
    switch (type) {
      case VoucherType.DISCOUNT:
        return (
          <DiscountFormView voucherProgram={programData?.payload as Program} />
        );
      case VoucherType.PER_DIEM:
        return (
          <PerDiemFormView voucherProgram={programData?.payload as Program} />
        );
      case VoucherType.PRE_FIXE:
        return (
          <PreFixeFormView voucherProgram={programData?.payload as Program} />
        );
      default:
        return null;
    }
  };

  if (isProgramLoading) {
    return (
      <Grid gutter={0}>
        <Card>
          <Skeleton parts={["title", "divider", "text-2", "labelField"]} />
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
      <Row>
        <Card
          className="network-content"
          page
          header={
            <div>
              <Typography h2>{programData?.payload?.name}</Typography>
            </div>
          }
        >
          {programData?.payload && (
            <Row>
              <Column offset={3} size={6}>
                <div className="ui-flex column mb-20">
                  <Typography size="small" muted className="mb-10">
                    {t("VOUCHER_TYPE")}
                  </Typography>
                  <Typography>{programData?.payload.type}</Typography>
                </div>
                {renderEditViewByType(params.type)}
              </Column>
            </Row>
          )}
        </Card>
      </Row>
    </Grid>
  );
}

export default VoucherEdit;

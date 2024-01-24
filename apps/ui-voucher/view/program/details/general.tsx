import { useContext } from "react";
import {
  Card,
  Column,
  Link,
  Row,
  Typography,
  useTranslation,
  AppContext,
  GoToOMSLink,
} from "@butlerhospitality/ui-sdk";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { PERMISSION } from "@butlerhospitality/shared";
import { programEditDetails } from "../../../routes";

function GeneralDetails({ voucherProgram }: any) {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);

  const canUpdateVoucherPrograms =
    can && can(PERMISSION.VOUCHER.CAN_UPDATE_VOUCHER_PROGRAM);
  const history = useHistory();

  return (
    <Row>
      <Column>
        <Card
          page
          className="network-content"
          header={
            <>
              <Typography h2>{t("GENERAL_INFORMATION")}</Typography>
              {canUpdateVoucherPrograms && (
                <Link
                  data-testId="edit"
                  component="button"
                  onClick={() => {
                    if (voucherProgram && voucherProgram.id)
                      history.push(
                        `${programEditDetails.path}/${encodeURIComponent(
                          voucherProgram?.id
                        )}`
                      );
                  }}
                >
                  {t("EDIT")}
                </Link>
              )}
            </>
          }
        >
          {voucherProgram?.hotels?.[0].name && (
            <Row>
              <div className="ui-flex between v-start">
                <div className="ui-flex column">
                  <Typography size="small" muted className="pb-10">
                    {t("HOTEL_NAME")}
                  </Typography>
                  <Link
                    size="medium"
                    component={RouterLink}
                    to={`/network/hotel/view/${voucherProgram?.hotels?.[0].id}`}
                  >
                    {voucherProgram?.hotels?.[0].name || "n/a"}
                  </Link>
                </div>
                {voucherProgram?.oms_id &&
                  voucherProgram?.hotels?.[0]?.oms_id && (
                    <GoToOMSLink
                      path={`vouchers/hotels/${voucherProgram.hotels[0].oms_id}/vouchers/${voucherProgram.oms_id}/`}
                    />
                  )}
              </div>
            </Row>
          )}

          {voucherProgram?.name && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("VOUCHER_NAME")}
                </Typography>
                <Typography>{voucherProgram?.name}</Typography>
              </div>
            </Row>
          )}

          {voucherProgram?.type && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("VOUCHER_TYPE")}
                </Typography>
                <Typography>{voucherProgram?.type}</Typography>
              </div>
            </Row>
          )}

          {voucherProgram?.payer && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("PAYER")}
                </Typography>
                <Typography>{voucherProgram?.payer}</Typography>
              </div>
            </Row>
          )}

          {voucherProgram?.payer === "HOTEL" && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("PAYER_PERCENTAGE")}
                </Typography>
                <Typography>{voucherProgram?.payer_percentage} %</Typography>
              </div>
            </Row>
          )}

          {voucherProgram?.description && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("NOTES")}
                </Typography>
                <Typography>{voucherProgram?.description}</Typography>
              </div>
            </Row>
          )}

          {voucherProgram?.code_limit && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("CODE_LIMIT_PER_DAY")}
                </Typography>
                <Typography>{voucherProgram?.code_limit}</Typography>
              </div>
            </Row>
          )}
        </Card>
      </Column>
    </Row>
  );
}

export default GeneralDetails;

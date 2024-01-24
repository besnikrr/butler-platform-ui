import { useContext } from "react";
import {
  Card,
  Column,
  Divider,
  Link,
  Row,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTranslation,
  AppContext,
} from "@butlerhospitality/ui-sdk";
import { useHistory } from "react-router-dom";
import {
  PaymentType,
  PERMISSION,
  VoucherType,
} from "@butlerhospitality/shared";
import { programEditConfigs } from "../../../routes";

export default ({ voucherProgram }: { voucherProgram: any }): JSX.Element => {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const history = useHistory();

  const canUpdateVoucherPrograms =
    can && can(PERMISSION.VOUCHER.CAN_UPDATE_VOUCHER_PROGRAM);

  const renderPerDiemConfigs = (data: any) => {
    return (
      <Row>
        <div className="ui-flex column">
          <Typography size="small" muted className="pb-10">
            {t("AMOUNT")}
          </Typography>
          <Typography>${data?.amount}</Typography>
        </div>
      </Row>
    );
  };

  const renderDiscountConfigs = (data: any) => {
    return (
      <Row>
        <Column size={2}>
          <div className="ui-flex column">
            <Typography size="small" muted className="pb-10">
              {t("PAYMENT_TYPE")}
            </Typography>
            <Typography>
              {data?.amount_type === PaymentType.FIXED ? "$" : "%"}
            </Typography>
          </div>
        </Column>
        <Column size={2}>
          <div className="ui-flex column">
            <Typography size="small" muted className="pb-10">
              {t("AMOUNT")}
            </Typography>
            {data?.amount_type === PaymentType.FIXED ? (
              <Typography>${data?.amount}</Typography>
            ) : (
              <Typography>{data?.amount}%</Typography>
            )}
          </div>
        </Column>
      </Row>
    );
  };

  const renderPreFixeConfigs = (data: any) => {
    const categoryName = data?.rules?.[0].categories?.[0].parent_category.name;

    return (
      <>
        <Row>
          <Column size={2}>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("MEAL_PERIOD")}
              </Typography>
              <Typography data-testId="category">{categoryName}</Typography>
            </div>
          </Column>
          <Column size={2}>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("PRICE")}
              </Typography>
              <Typography data-testId="amount">${data.amount}</Typography>
            </div>
          </Column>
        </Row>

        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell as="th">{t("SUBCATEGORIES")}</TableCell>
              <TableCell as="th">{t("QUANTITY")}</TableCell>
              <TableCell as="th">{t("PRICE_LIMIT")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data?.rules || []).map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item?.categories
                    ?.map((element: any) => element.name)
                    .join(", ")}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.max_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };

  const renderByType = (data: any) => {
    switch (data.type) {
      case VoucherType.DISCOUNT:
        return renderDiscountConfigs(data);
      case VoucherType.PER_DIEM:
        return renderPerDiemConfigs(data);
      case VoucherType.PRE_FIXE:
        return renderPreFixeConfigs(data);
      default: {
        return null;
      }
    }
  };

  const redirectToEdit = (data: any) => {
    if (data && data.id) {
      history.push(
        `${programEditConfigs.path}/${data.type}/${encodeURIComponent(data.id)}`
      );
    }
  };
  return (
    <Row>
      <Column>
        <Card
          page
          className="network-content"
          header={
            <>
              <Typography h2>{t("CONFIGS")}</Typography>
              {voucherProgram && canUpdateVoucherPrograms && (
                <Link
                  data-testId="edit"
                  component="button"
                  onClick={() => {
                    redirectToEdit(voucherProgram);
                  }}
                >
                  {t("EDIT")}
                </Link>
              )}
            </>
          }
        >
          {voucherProgram && renderByType(voucherProgram)}
        </Card>
      </Column>
    </Row>
  );
};

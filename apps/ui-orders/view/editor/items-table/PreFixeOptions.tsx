import React from "react";
import { TableRow, TableCell, ButtonBase, Link, useTranslation } from "@butlerhospitality/ui-sdk";
import { Code, ProgramRules } from "@butlerhospitality/shared";
import { useOrderContext } from "../store/order-context";
import { SET_VOUCHER_SELECTION, CLEAR_VOUCHER_SELECTION } from "../store/constants";

interface PreFixeOptionsProps {
  voucher: Code;
}

const PreFixeOptions: React.FC<PreFixeOptionsProps> = ({ voucher }): any => {
  const {
    dispatch,
    state: { voucherItems },
  } = useOrderContext();
  const { t } = useTranslation();

  const makeVoucherSelection = (rule: ProgramRules) => {
    dispatch({
      type: SET_VOUCHER_SELECTION,
      payload: { code: voucher.code, voucherId: voucher.id, ...rule },
    });
  };

  const clearVoucherSelection = (rule: ProgramRules) => {
    dispatch({
      type: CLEAR_VOUCHER_SELECTION,
      payload: { code: voucher.code, voucherId: voucher.id, ...rule },
    });
  };

  return (voucher.program.rules || []).map((rule: ProgramRules) => {
    const itemsAddedToThisRule: number =
      (Object.values(voucherItems)
        .filter((item: any) => item.ruleId === rule.id)
        .reduce((sum, { quantity }: any): number => sum + quantity, 0) as number) || 0;
    const selected = itemsAddedToThisRule >= rule.quantity;

    return (
      <TableRow noHover key={rule.id} data-voucherselected={selected}>
        <TableCell colspan={2}>{rule.categories.map((c: any) => c.name).join(", ")}</TableCell>
        <TableCell colspan={2} wrapperClassName="ui-flex w-100 end">
          {selected ? (
            <Link component={ButtonBase} onClick={() => clearVoucherSelection(rule)} size="small" variant="danger">
              {t("clear_selection")}
            </Link>
          ) : (
            <Link component={ButtonBase} onClick={() => makeVoucherSelection(rule)} size="small" variant="primary">
              {t("make_selection")}
            </Link>
          )}
        </TableCell>
      </TableRow>
    );
  });
};

export default PreFixeOptions;

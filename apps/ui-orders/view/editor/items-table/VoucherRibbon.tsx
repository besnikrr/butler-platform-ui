import React from "react";
import { Typography, Button, Icon } from "@butlerhospitality/ui-sdk";
import { Code, VoucherType } from "@butlerhospitality/shared";
import { voucherColors, voucherTypes } from "../../../util/constants";
import { useOrderContext } from "../store/order-context";
import { REMOVE_VOUCHER } from "../store/constants";

interface VoucherRibbonProps {
  voucher: Code;
}

const VoucherRibbon: React.FC<VoucherRibbonProps> = ({ voucher }) => {
  const { dispatch } = useOrderContext();

  const removeVoucher = () => {
    dispatch({ type: REMOVE_VOUCHER, payload: voucher.id });
  };

  const renderVoucherDetails = React.useMemo(() => {
    switch (voucher.program.type) {
      case VoucherType.PER_DIEM:
        return <Typography>{voucher.program.amount}</Typography>;
      case VoucherType.DISCOUNT:
        return <Typography>{voucher.program.amount}%</Typography>;
      case VoucherType.PRE_FIXE:
        return voucher.program.rules?.reduce(
          (prev: any, curr: any): any => [
            prev,
            `${prev ? ", " : ""}(${curr.quantity}) `,
            curr.categories.map((c: any) => c.name).join(", "),
          ],
          null
        );
      default:
        return null;
    }
  }, [voucher]);

  return (
    <tr>
      <td colSpan={4}>
        <div className="ui-flex column w-100">
          <div
            className="ui-flex v-center between w-100 px-10"
            style={{
              backgroundColor: `rgb(${voucherColors[voucher.program.type]})`,
              height: 45,
            }}
          >
            <Typography className="text-secondary">
              Voucher Applied: {voucherTypes[voucher.program.type]} - {voucher.code} - {voucher.program.name}
            </Typography>
            <Button className="text-secondary" size="xsmall" iconOnly variant="ghost" onClick={removeVoucher}>
              <Icon type="Close" size={16} />
            </Button>
          </div>
          <div
            className="ui-flex v-center between w-100 pl-10"
            style={{
              backgroundColor: `rgba(${voucherColors[voucher.program.type]}, 0.5)`,
              height: 45,
            }}
          >
            <Typography>
              {voucherTypes[voucher.program.type]}: {renderVoucherDetails}
            </Typography>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default VoucherRibbon;

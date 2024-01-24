import { Decimal } from "decimal.js-light";
import { PaymentType, VoucherPayer, VoucherType, AmountType } from "@butlerhospitality/shared";

Decimal.config({ rounding: Decimal.ROUND_HALF_UP });

export enum PriceMeasurementType {
  AMOUNT = "AMOUNT",
  PERCENTAGE = "PERCENTAGE",
}

export interface IOrderModifierOption {
  id: number;
  price: number;
  quantity: number;
}

export interface IOrderItem {
  id: number;
  price: number;
  options: IOrderModifierOption[];
  quantity: number;
  codeId?: number;
  ruleId?: number;
}

export interface IOrderCustomItem {
  price: number;
  quantity: number;
  codeId?: number;
  ruleId?: number;
}

export interface IOrderCalculationDiscount {
  type: PriceMeasurementType;
  value: number;
  valueUsed?: number;
}

export interface IOrderCalculationCompensation {
  type: PriceMeasurementType;
  value: number;
}

export interface IOrderCalculationVoucher {
  id: number;
  type: VoucherType;
  value: number;
  valueUsed?: number;
  amountType: AmountType;
  payer: VoucherPayer;
  payerPercentage: number;
}

export interface IOrderCalculationInput {
  items: IOrderItem[];
  customItems?: IOrderCustomItem[];
  tip: { value: number; type: PriceMeasurementType };
  discount?: IOrderCalculationDiscount;
  compensation?: IOrderCalculationCompensation;
  vouchers?: IOrderCalculationVoucher[];
  taxRate?: number;
  isTaxExempt?: boolean;
  paymentType: PaymentType;
}

export interface IOrderCalculationOutput {
  receiptAmount: string;
  taxAmount: string;
  totalNet: string;
  totalGross: string;
  grandTotal: string;
  totalVoucherPrice: string;
  tip: string;
}

export const getPerdiemVoucherValue = (voucher: IOrderCalculationVoucher) => {
  if (voucher.amountType !== AmountType.FIXED) {
    throw new Error("Perdiem supports only FIXED type");
  }
  try {
    const voucherValue = new Decimal(voucher.value);
    const voucherValueUsed = new Decimal(voucher.valueUsed ?? 0);
    return voucherValue.sub(voucherValueUsed);
  } catch (e) {
    throw new Error("Attributes missing for perdiem voucher value");
  }
};

export const calculateBasicTotalPrice = (input: IOrderItem | IOrderCustomItem, isCustom = false) => {
  if (isCustom) {
    return new Decimal(input.price).mul(input.quantity);
  }
  if ((input.codeId && input.ruleId == null) || (input.ruleId && input.codeId == null)) {
    throw new Error(`Inconsistency between rule id and code id ${input}`);
  }

  if (input.codeId && input.ruleId) {
    return new Decimal(0);
  }

  return new Decimal(input.price).mul(input.quantity);
};

export const calculateCustomItemsValue = (items: IOrderCustomItem[]): Decimal => {
  let totalItemsPrice: Decimal = new Decimal(0.0);
  items.forEach((item: IOrderCustomItem) => {
    const totalItemPrice: Decimal = calculateBasicTotalPrice(item, true);
    totalItemsPrice = totalItemsPrice.add(totalItemPrice);
  });
  return totalItemsPrice;
};

export const calculateOptionsValue = (options: IOrderModifierOption[], itemQuantity: number): Decimal => {
  let totalOptionsPrice: Decimal = new Decimal(0.0);
  options.forEach((option: IOrderModifierOption) => {
    const totalOptionPrice = calculateBasicTotalPrice({
      ...option,
      quantity: 1,
    });
    totalOptionsPrice = totalOptionsPrice.add(totalOptionPrice);
  });
  return totalOptionsPrice.mul(itemQuantity);
};

export const calculateOrderItemsValue = (items: IOrderItem[]): Decimal => {
  let totalItemsPrice: Decimal = new Decimal(0.0);
  items.forEach((item: IOrderItem) => {
    const totalItemPrice: Decimal = calculateBasicTotalPrice(item);
    const totalModifiersPrice = calculateOptionsValue(item.options ?? [], item.quantity);
    totalItemsPrice = totalItemsPrice.add(totalItemPrice.add(totalModifiersPrice));
  });
  return totalItemsPrice;
};

export const calculateItemsValue = (items: IOrderItem[], customItems: IOrderCustomItem[]): Decimal => {
  const totalItemsPrice: Decimal = calculateOrderItemsValue(items);
  const totalCustomItemsPrice: Decimal =
    customItems && customItems.length ? calculateCustomItemsValue(customItems) : new Decimal(0.0);

  return totalItemsPrice.add(totalCustomItemsPrice);
};

export const calculateReceiptAmount = (items: IOrderItem[], customItems: IOrderCustomItem[]): Decimal => {
  return calculateItemsValue(items, customItems);
};

export const getDiscountValue = (amount: Decimal, discount: IOrderCalculationDiscount): Decimal => {
  if (!discount) {
    return new Decimal(0);
  }
  const discountValue = new Decimal(discount.value);
  const value =
    discount.type === PriceMeasurementType.PERCENTAGE ? discountValue.div(new Decimal(100)).mul(amount) : discountValue;
  if (amount.comparedTo(value) < 0) {
    throw new Error("Discount cannot be greater than receipt amount");
  }
  return value;
};

export const getVoucherValue = (amount: Decimal, voucher: IOrderCalculationVoucher): Decimal => {
  let voucherValue = new Decimal(0);
  if (voucher.amountType === AmountType.PERCENTAGE) {
    voucherValue = amount.mul(new Decimal(voucher.value)).div(new Decimal(100));
  } else {
    voucherValue = new Decimal(voucher.value);
  }
  if (voucher.type === VoucherType.PER_DIEM) {
    voucherValue = getPerdiemVoucherValue(voucher);
  }

  if (voucher.type === VoucherType.DISCOUNT && voucherValue.comparedTo(amount) > 0) {
    return amount;
  }
  return voucherValue;
};

export const getTotalVoucherPrice = (amount: Decimal, vouchers: IOrderCalculationVoucher[]) => {
  let totalVoucherPrice = new Decimal(0);
  if (vouchers.length > 0) {
    if (vouchers.length == 1) {
      if (vouchers[0].type === VoucherType.DISCOUNT) {
        totalVoucherPrice = getVoucherValue(amount, vouchers[0]);
      }
      if (vouchers[0].type === VoucherType.PER_DIEM) {
        if (vouchers[0].amountType !== AmountType.FIXED) {
          throw new Error("Perdiem supports only AMOUNT type");
        }
        totalVoucherPrice = getVoucherValue(amount, vouchers[0]);
        if (totalVoucherPrice.comparedTo(amount) >= 0) {
          totalVoucherPrice = amount;
        }
      }
      if (vouchers[0].type === VoucherType.PRE_FIXE) {
        if (vouchers[0].amountType !== AmountType.FIXED) {
          throw new Error("Prefie supports only AMOUNT type");
        }
        totalVoucherPrice = totalVoucherPrice.add(vouchers[0].value);
      }
    } else {
      vouchers.forEach((voucher: IOrderCalculationVoucher) => {
        if (voucher.type !== VoucherType.PRE_FIXE) {
          throw new Error("Multiple vouchers are allowed for PREFIXE only");
        }
        if (voucher.amountType !== AmountType.FIXED) {
          throw new Error("Prefixe supports only AMOUNT type");
        }
        totalVoucherPrice = totalVoucherPrice.add(voucher.value);
      });
    }
  }
  return totalVoucherPrice;
};

export interface ITaxAmountInput {
  amount: Decimal;
  taxRate: number;
  isTaxExempt: boolean;
}

export const calculateTaxAmount = (input: ITaxAmountInput) => {
  const { amount, taxRate, isTaxExempt } = input;
  return isTaxExempt ? new Decimal(0) : amount.mul(taxRate).div(new Decimal(100));
};

export interface ITotalNetInput {
  receiptAmount: Decimal;
  discount?: IOrderCalculationDiscount;
  vouchers?: IOrderCalculationVoucher[];
}

export const calculateTotalNet = (input: ITotalNetInput): Decimal => {
  const { receiptAmount, discount, vouchers } = input;
  let voucher: IOrderCalculationVoucher | null = null;
  if (vouchers && vouchers.length) {
    [voucher] = vouchers;
  }
  if (voucher && discount) {
    throw new Error("Cannot apply both voucher and discount to an order");
  }
  let discountValue: Decimal = discount ? getDiscountValue(receiptAmount, discount) : new Decimal(0);

  if (voucher?.type === VoucherType.DISCOUNT) {
    discountValue = getVoucherValue(receiptAmount, voucher);
  }
  const zeroAmount: Decimal = new Decimal(0);
  const totalNet = receiptAmount.sub(discountValue);

  return totalNet.comparedTo(zeroAmount) > 0 ? totalNet : zeroAmount;
};

export interface ITotalGrossInput {
  totalNet: Decimal;
  taxAmount: Decimal;
}

export const calculateTotalGross = (input: ITotalGrossInput): Decimal => {
  const { totalNet, taxAmount } = input;
  return totalNet.add(taxAmount);
};

export interface IGrandTotalInput {
  totalGross: Decimal;
  vouchers: IOrderCalculationVoucher[];
  tip: Decimal;
}

export const getTipValue = (amount: Decimal, tip: { value: number; type: PriceMeasurementType }) => {
  if (!tip) {
    return new Decimal(0);
  }
  return tip.type === PriceMeasurementType.PERCENTAGE
    ? amount.mul(new Decimal(tip.value)).div(new Decimal(100))
    : new Decimal(tip.value);
};

export const calculateGrandTotal = (input: IGrandTotalInput): Decimal => {
  const { totalGross, vouchers, tip } = input;
  const voucher = vouchers && vouchers.length ? vouchers[0] : null;

  const grandTotal = totalGross
    .add(tip)
    .sub(voucher && voucher.type === VoucherType.PER_DIEM ? getPerdiemVoucherValue(voucher) : new Decimal(0));
  return grandTotal.comparedTo(new Decimal(0)) <= 0 ? new Decimal(0) : grandTotal;
};

export interface IOrderCalculation {
  calculate(input: IOrderCalculationInput): IOrderCalculationOutput;
}

export const calculate = (input: IOrderCalculationInput): IOrderCalculationOutput => {
  const { items, customItems, tip, discount, taxRate, isTaxExempt } = input;
  let { vouchers } = input;
  if (!vouchers) {
    vouchers = [];
  }

  const receiptAmount: Decimal = calculateReceiptAmount(items, customItems ?? []);
  const totalNet: Decimal = calculateTotalNet({
    receiptAmount,
    discount,
    vouchers,
  });
  const totalTip = getTipValue(receiptAmount, tip);
  const taxAmount: Decimal = calculateTaxAmount({
    amount: totalNet,
    taxRate: taxRate ?? 0,
    isTaxExempt: isTaxExempt ?? false,
  });
  const totalGross: Decimal = calculateTotalGross({
    taxAmount,
    totalNet,
  });
  const grandTotal: Decimal = calculateGrandTotal({
    tip: totalTip,
    totalGross,
    vouchers,
  });
  const totalVoucherPrice: Decimal = getTotalVoucherPrice(
    vouchers.length && vouchers[0].type === VoucherType.PER_DIEM ? totalGross : receiptAmount,
    vouchers
  );

  return {
    receiptAmount: receiptAmount.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    totalNet: totalNet.toFixed(2),
    totalGross: totalGross.toFixed(2),
    tip: totalTip.toFixed(2),
    grandTotal: grandTotal.toFixed(2),
    totalVoucherPrice: totalVoucherPrice.toFixed(2),
  };
};

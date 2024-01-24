import { PriceMeasurementType } from "../common/common";

export type Discount = {
  id: number;
  code: string;
  name: string;
  amount: number;
  endDate: string;
  startDate: string;
  valueUsed: number;
  type: PriceMeasurementType;
};

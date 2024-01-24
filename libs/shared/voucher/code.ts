import { BaseEntity } from "./base";
import { Program } from "./program";

export interface Code extends BaseEntity {
  readonly id: number;
  readonly oms_id?: number;
  name: string;
  code: string;
  program: Program;
  hotel: number;
  amount_used?: number;
  claimed_date?: string;
  order_id: number;
}

export enum CodeStatus {
  PENDING = "PENDING",
  REDEEMED = "REDEEMED",
}

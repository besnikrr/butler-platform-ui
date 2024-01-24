import { BaseEntity } from "./base";
import { Category, Item } from "../menu";

export interface VoucherMenu extends BaseEntity {
  readonly id: number;
  readonly oms_id?: number;
  name: string;
  status: string;
  products: Item[];
  categories: Category[];
}

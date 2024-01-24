import { BaseEntity } from "./base";

export interface ProgramCategory extends BaseEntity {
  readonly id: number;
  readonly oms_id?: number;
  name: string;
  start_date: string;
  end_date: string;
  parent_category: {
    readonly id: number;
    readonly oms_id?: number;
    name: string;
    start_date?: string;
    end_date?: string;
  };
  sub_categories: ProgramSubCategory[];
}

export interface ProgramSubCategory extends BaseEntity {
  readonly id: number;
  readonly oms_id?: number;
  name: string;
  start_date: string;
  end_date: string;
  parent_category: number;
}

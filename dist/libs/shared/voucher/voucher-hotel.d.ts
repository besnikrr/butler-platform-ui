import { BaseEntity } from "./base";
export interface VoucherHotel extends BaseEntity {
    readonly id: number;
    readonly oms_id?: number;
    name: string;
    active: boolean;
    hub: VoucherHub[];
}
export interface VoucherHub extends BaseEntity {
    readonly id: number;
    name: string;
    readonly oms_id?: number;
    active: boolean;
}

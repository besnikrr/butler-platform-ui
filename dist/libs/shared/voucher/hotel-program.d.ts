import { BaseEntity } from "./base";
import { Program } from "./program";
interface HotelProgramList extends BaseEntity {
    readonly id: number;
    readonly oms_id?: number;
    name: string;
    hub_id?: number;
    active: boolean;
    programs: Program[];
    program_types: string[];
}
export type { HotelProgramList };

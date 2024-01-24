import { BaseEntityV2, Coordinate } from "./base";
import type { CityV2 } from "./city-v2";
import type { HotelV2 } from "./hotel-v2";
interface Hub extends BaseEntityV2 {
    readonly id: number | string;
    readonly oms_id?: number;
    city_id?: number | string;
    city?: CityV2;
    name: string;
    active: boolean;
    tax_rate: number;
    hotels?: HotelV2[];
    contact_phone: string;
    contact_email: string;
    address_street: string;
    address_number: string;
    address_town: string;
    address_zip_code: string;
    address_coordinates: Coordinate;
    has_nextmv_enabled: boolean;
    has_expeditor_app_enabled: boolean;
}
declare type CreateHub = Omit<Hub & {
    address_coordinates: string;
}, "id" | "created_at" | "updated_at" | "deleted_at">;
declare type UpdateHub = Omit<Partial<Hub & {
    address_coordinates?: string;
    status?: boolean;
}>, "id" | "created_at" | "updated_at" | "deleted_at" | "room_numbers">;
declare const createHubValidator: any;
export { Hub as HubV2, CreateHub, UpdateHub, createHubValidator as createHubValidatorV2, };

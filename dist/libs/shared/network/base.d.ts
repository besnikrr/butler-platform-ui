interface BaseEntity {
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}
interface Coordinate {
    latitude?: number;
    longitude?: number;
    x?: number;
    y?: number;
}
interface Address {
    address_town?: string;
    address_street?: string;
    address_number?: string;
    address_zip_code?: string;
}
export { BaseEntity as BaseEntityV2, Coordinate, Address as AddressV2 };

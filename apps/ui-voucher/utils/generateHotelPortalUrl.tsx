import { HOTEL_PORTAL_URL } from "@butlerhospitality/shared";

function generateHotelPortalUrl(hotelId: number | undefined): string {
  return `${HOTEL_PORTAL_URL}${hotelId}`;
}

export default generateHotelPortalUrl;

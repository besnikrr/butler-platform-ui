"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOTEL_PORTAL_URL = exports.ROLE = void 0;
const ROLE = {
    HOTEL_PARTNER: process.env.HOTEL_PARTNER_ROLE || process.env.NX_HOTEL_PARTNER_ROLE,
    SUPER_ADMIN: process.env.SUPER_ADMIN_ROLE || process.env.NX_SUPER_ADMIN_ROLE,
};
exports.ROLE = ROLE;
const HOTEL_PORTAL_URL = "https://dev.partners.butlerhospitality.com/?token=lhi6bZXSzNsx0vIXPy4rhb-_IWJRzurG9AWqYiqnPwceNAC0Aws9Bfz8d5sk1RgJI4d4NpfPLWXmV8kixVDKhjJBGXa9oOaH2ia9LVd3vE_nVb9JntQrOLt2RQ7hOQ7oVLogBQ&email=admin@butlerhospitality.com&isAdmin=true&hotel_id=";
exports.HOTEL_PORTAL_URL = HOTEL_PORTAL_URL;
//# sourceMappingURL=constants.js.map
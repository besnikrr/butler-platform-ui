const ROLE: any = {
  HOTEL_PARTNER:
    process.env.HOTEL_PARTNER_ROLE || process.env.NX_HOTEL_PARTNER_ROLE,
  SUPER_ADMIN: process.env.SUPER_ADMIN_ROLE || process.env.NX_SUPER_ADMIN_ROLE,
};

const HOTEL_PORTAL_URL =
  "https://dev.partners.butlerhospitality.com/?token=lhi6bZXSzNsx0vIXPy4rhb-_IWJRzurG9AWqYiqnPwceNAC0Aws9Bfz8d5sk1RgJI4d4NpfPLWXmV8kixVDKhjJBGXa9oOaH2ia9LVd3vE_nVb9JntQrOLt2RQ7hOQ7oVLogBQ&email=admin@butlerhospitality.com&isAdmin=true&hotel_id=";
export { ROLE, HOTEL_PORTAL_URL };

export const voucherHotelKeys = {
  all: ["voucher-hotel"],
  list: (page: number) => [...voucherHotelKeys.all, "list", page],
  details: (id: number | string) => [...voucherHotelKeys.all, "details", id],
};

export const voucherMenuKeys = {
  all: ["voucher-menu"],
  list: (page: number) => [...voucherMenuKeys.all, "list", page],
  details: (id: number | string) => [...voucherMenuKeys.all, "details", id],
};

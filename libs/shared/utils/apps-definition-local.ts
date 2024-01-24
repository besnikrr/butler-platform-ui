export enum AppEnum {
  DASHBOARD = "dashboard",
  TENANT = "tenant",
  NETWORK = "network",
  MENU = "menu",
  VOUCHER = "voucher",
  DISCOUNT = "discount",
  IAM = "iam",
  ORDER = "order",
}

export const appsDefinitionLocal = {
  [AppEnum.DASHBOARD]: {
    port: 3331,
    title: "DashboardService",
    description: "Dashboard Service",
  },
  [AppEnum.TENANT]: {
    port: 3332,
    title: "TenantService",
    description: "Tenant Service",
  },
  [AppEnum.NETWORK]: {
    port: 3333,
    title: "Network Service",
    description: "Network Service",
  },
  [AppEnum.MENU]: {
    port: 3222,
    title: "Menu Service",
    description: "Menu Service",
  },
  [AppEnum.VOUCHER]: {
    port: 3335,
    title: "Voucher Service",
    description: "Voucher Service",
  },
  [AppEnum.DISCOUNT]: {
    port: 3336,
    title: "Discount Service",
    description: "Discount Service",
  },
  [AppEnum.IAM]: {
    port: 3337,
    title: "IAM Service",
    description: "Identity Access Management Service",
  },
  [AppEnum.ORDER]: {
    port: 3338,
    title: "Order Service",
    description: "Order Service",
  },
};

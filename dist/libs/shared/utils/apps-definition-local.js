"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appsDefinitionLocal = exports.AppEnum = void 0;
var AppEnum;
(function (AppEnum) {
    AppEnum["DASHBOARD"] = "dashboard";
    AppEnum["TENANT"] = "tenant";
    AppEnum["NETWORK"] = "network";
    AppEnum["network"] = "network";
    AppEnum["MENU"] = "menu";
    AppEnum["VOUCHER"] = "voucher";
    AppEnum["IAM"] = "iam";
    AppEnum["ORDERS"] = "orders";
})(AppEnum || (AppEnum = {}));
exports.AppEnum = AppEnum;
const appsDefinitionLocal = {
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
        port: 3323,
        title: "Network Service",
        description: "Network Service",
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
    [AppEnum.IAM]: {
        port: 3336,
        title: "IAM Service",
        description: "Identity Access Management Service",
    },
    [AppEnum.ORDERS]: {
        port: 3337,
        title: "ORDERS Service",
        description: "Order Service",
    },
};
exports.appsDefinitionLocal = appsDefinitionLocal;
//# sourceMappingURL=apps-definition-local.js.map
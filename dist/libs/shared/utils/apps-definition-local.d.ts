declare enum AppEnum {
    DASHBOARD = "dashboard",
    TENANT = "tenant",
    NETWORK = "network",
    network = "network",
    MENU = "menu",
    VOUCHER = "voucher",
    IAM = "iam",
    ORDERS = "orders"
}
declare const appsDefinitionLocal: {
    dashboard: {
        port: number;
        title: string;
        description: string;
    };
    tenant: {
        port: number;
        title: string;
        description: string;
    };
    network: {
        port: number;
        title: string;
        description: string;
    };
    menu: {
        port: number;
        title: string;
        description: string;
    };
    voucher: {
        port: number;
        title: string;
        description: string;
    };
    iam: {
        port: number;
        title: string;
        description: string;
    };
    orders: {
        port: number;
        title: string;
        description: string;
    };
};
export { AppEnum, appsDefinitionLocal };

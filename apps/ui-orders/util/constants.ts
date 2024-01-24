import { Category, Modifier, ModifierOption, VoucherType } from "@butlerhospitality/shared";

export enum ORDER_STATUS {
  PENDING = "PENDING",
  CONFIRMATION = "CONFIRMATION",
  PREPARATION = "PREPARATION",
  IN_DELIVERY = "IN_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
  MERGED = "MERGED",
  SCHEDULED = "SCHEDULED",
}

export enum ORDER_TYPE {
  ROOM_SERVICE = "ROOM_SERVICE",
  CATERING = "CATERING",
  AMENITY = "AMENITY",
  FAAS = "FAAS",
}

export const voucherColors = {
  [VoucherType.PRE_FIXE]: [157, 53, 81],
  [VoucherType.PER_DIEM]: [88, 180, 198],
  [VoucherType.DISCOUNT]: [121, 205, 107],
};

export const voucherTypes = {
  [VoucherType.PRE_FIXE]: "Pre-Fixe",
  [VoucherType.PER_DIEM]: "Per Diem",
  [VoucherType.DISCOUNT]: "Discount",
};

export type StoreItemTypes = "items" | "voucherItems";

export enum CompensationTypes {
  AMOUNT = "AMOUNT",
  PERCENTAGE = "PERCENTAGE",
}

export type Schedule = {
  key: string;
  value: string;
  disabled?: boolean;
  hidden?: boolean;
};

export const schedules = [
  {
    key: "",
    value: "Select schedule",
    disabled: true,
    hidden: true,
  },
  { key: "06:30:00", value: "6:30 AM" },
  { key: "06:45:00", value: "6:45 AM" },
  { key: "07:00:00", value: "7:00 AM" },
  { key: "07:15:00", value: "7:15 AM" },
  { key: "07:30:00", value: "7:30 AM" },
  { key: "07:45:00", value: "7:45 AM" },
  { key: "08:00:00", value: "8:00 AM" },
  { key: "08:15:00", value: "8:15 AM" },
  { key: "08:30:00", value: "8:30 AM" },
  { key: "08:45:00", value: "8:45 AM" },
  { key: "09:00:00", value: "9:00 AM" },
  { key: "09:15:00", value: "9:15 AM" },
  { key: "09:30:00", value: "9:30 AM" },
  { key: "09:45:00", value: "9:45 AM" },
  { key: "10:00:00", value: "10:00 AM" },
  { key: "10:15:00", value: "10:15 AM" },
  { key: "10:30:00", value: "10:30 AM" },
  { key: "10:45:00", value: "10:45 AM" },
  { key: "11:00:00", value: "11:00 AM" },
  { key: "11:15:00", value: "11:15 AM" },
  { key: "11:30:00", value: "11:30 AM" },
  { key: "11:45:00", value: "11:45 AM" },
  { key: "12:00:00", value: "12:00 PM" },
  { key: "12:15:00", value: "12:15 PM" },
  { key: "12:30:00", value: "12:30 PM" },
  { key: "12:45:00", value: "12:45 PM" },
  { key: "13:00:00", value: "1:00 PM" },
  { key: "13:15:00", value: "1:15 PM" },
  { key: "13:30:00", value: "1:30 PM" },
  { key: "13:45:00", value: "1:45 PM" },
  { key: "14:00:00", value: "2:00 PM" },
  { key: "14:15:00", value: "2:15 PM" },
  { key: "14:30:00", value: "2:30 PM" },
  { key: "14:45:00", value: "2:45 PM" },
  { key: "15:00:00", value: "3:00 PM" },
  { key: "15:15:00", value: "3:15 PM" },
  { key: "15:30:00", value: "3:30 PM" },
  { key: "15:45:00", value: "3:45 PM" },
  { key: "16:00:00", value: "4:00 PM" },
  { key: "16:15:00", value: "4:15 PM" },
  { key: "16:30:00", value: "4:30 PM" },
  { key: "16:45:00", value: "4:45 PM" },
  { key: "17:00:00", value: "5:00 PM" },
  { key: "17:15:00", value: "5:15 PM" },
  { key: "17:30:00", value: "5:30 PM" },
  { key: "17:45:00", value: "5:45 PM" },
  { key: "18:00:00", value: "6:00 PM" },
  { key: "18:15:00", value: "6:15 PM" },
  { key: "18:30:00", value: "6:30 PM" },
  { key: "18:45:00", value: "6:45 PM" },
  { key: "19:00:00", value: "7:00 PM" },
  { key: "19:15:00", value: "7:15 PM" },
  { key: "19:30:00", value: "7:30 PM" },
  { key: "19:45:00", value: "7:45 PM" },
  { key: "20:00:00", value: "8:00 PM" },
  { key: "20:15:00", value: "8:15 PM" },
  { key: "20:30:00", value: "8:30 PM" },
  { key: "20:45:00", value: "8:45 PM" },
  { key: "21:00:00", value: "9:00 PM" },
  { key: "21:15:00", value: "9:15 PM" },
  { key: "21:30:00", value: "9:30 PM" },
  { key: "21:45:00", value: "9:45 PM" },
  { key: "22:00:00", value: "10:00 PM" },
  { key: "22:15:00", value: "10:15 PM" },
  { key: "22:30:00", value: "10:30 PM" },
  { key: "22:45:00", value: "10:45 PM" },
  { key: "23:00:00", value: "11:00 PM" },
];

export const orderTypeColor = {
  [ORDER_TYPE.AMENITY]: "#9D3551",
  [ORDER_TYPE.FAAS]: "#0D21A1",
  [ORDER_TYPE.ROOM_SERVICE]: "#004438",
  [ORDER_TYPE.CATERING]: "#00A878",
};

export const initialHubsAndStatusesState = {
  hubs: [],
  statuses: [
    {
      status: ORDER_STATUS.SCHEDULED,
      count: 0,
    },
    {
      status: ORDER_STATUS.PENDING,
      count: 0,
    },
    {
      status: ORDER_STATUS.CONFIRMATION,
      count: 0,
    },
    {
      status: ORDER_STATUS.PREPARATION,
      count: 0,
    },
    {
      status: ORDER_STATUS.IN_DELIVERY,
      count: 0,
    },
    {
      status: ORDER_STATUS.DELIVERED,
      count: 0,
    },
    {
      status: ORDER_STATUS.CANCELLED,
      count: 0,
    },
    {
      status: ORDER_STATUS.REJECTED,
      count: 0,
    },
    {
      status: ORDER_STATUS.MERGED,
      count: 0,
    },
  ],
};

export const discountExplanations = [
  { key: "Promotion", value: "Promotion" },
  { key: "Recovery", value: "Recovery" },
  { key: "Employee", value: "Employee" },
  { key: "GXUpsell", value: "GX Upsell" },
  { key: "SalesDepartment", value: "Hotel Sales Department Discount" },
  { key: "ExecutivesDiscount", value: "Hotel Executives Discount" },
  { key: "AccountManager", value: "Butler Account Manager Discount" },
  { key: "CorporateDiscount", value: "Butler Corporate Discount" },
  { key: "Other", value: "Other" },
];

export enum DiscountExplanations {
  PROMOTION = "Promotion",
  RECOVERY = "Recovery",
  EMPLOYEE = "Employee",
  GX_UPSELL = "GXUpsell",
  SALES_DEPARTMENT = "SalesDepartment",
  EXECUTIVES_DISCOUNT = "ExecutivesDiscount",
  ACCOUNT_MANAGER = "AccountManager",
  CORPORATE_DISCOUNT = "CorporateDiscount",
  Other = "Other",
}

export enum OrderStatuses {
  PENDING = "Pending",
  CONFIRMATION = "Confirmation",
  PREPARATION = "Preparation",
  IN_DELIVERY = "In delivery",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
  REJECTED = "Rejected",
  MERGED = "Merged",
  SCHEDULED = "Scheduled",
}

export const showOrderStatuses = [
  ORDER_STATUS.SCHEDULED,
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PREPARATION,
  ORDER_STATUS.IN_DELIVERY,
];

export enum PriceModifiers {
  DISCOUNT = "Discount",
  COMP = "Comp",
}

export interface OrderItem {
  id: number;
  name: string;
  category: Category;
  sort_order: number;
  price: number;
  is_popular: boolean;
  is_favorite: boolean;
  suggested_items: [];
  modifiers: Modifier[];
  base_price: number;
  image: string;
  image_base_url: string;
  options: ModifierOption[];
  comment: string;
  quantity: number;
  total: number;
  ruleId?: number;
  invalidError?: boolean;
  priceChangeWarning?: {
    from: number;
    to: number;
  } | null;
}

export interface CustomItem {
  id: string;
  name: string;
  quantity: number;
  total: number;
  comment: string;
  price: number;
}

export interface OrderVoucherItem extends OrderItem {
  ruleId: number;
  codeId: number;
  code: string;
}

// construct type ItemOnMenu from OrderItem without quantity, total, comment and options
export type ItemOnMenu = Omit<OrderItem, "quantity" | "total" | "comment" | "options">;

export interface FormattedMenu {
  id: number;
  oms_id?: number;
  name: string;
  categories: {
    [key: string]: {
      name: string;
      subcategories: {
        [key: string]: {
          name: string;
          sort_order: number;
          items: {
            [key: string]: ItemOnMenu;
          };
        };
      };
    };
  };
}

export const WebSocketsActionTypes = {
  ORDER_PICKUP: "order-pickup",
  ORDER_UPDATED: "order-updated",
  ORDER_CREATED: "order-created",
  ORDER_REJECTED: "order-rejected",
  ORDER_ASSIGNED: "order-assigned",
  ORDER_CONFIRMED: "order-confirmed",
  ORDER_CANCELLED: "order-cancelled",
  ORDER_REMOVED_FOOD_CARRIER: "order-remove-food-carrier",
};

export type OrderQueryParams = {
  search?: string;
  statuses?: string[];
  hubIds?: string[];
  city?: string[];
  order?: number;
  paginated?: boolean;
};
export type CityHubQueryParams = {
  name?: string;
  page?: number;
  pageSize?: number;
  paginated?: boolean;
  statuses?: string[];
};

export enum PaymentType {
  CREDIT_CARD = "CREDIT_CARD",
  CHARGE_TO_ROOM = "CHARGE_TO_ROOM",
}

export type Order = {
  id: number;
  status: ORDER_STATUS;
  confirmedDate: string;
  number: number;
  date: string;
  client: {
    id: number;
    email: string;
    name: string;
    phoneNumber: string;
  };
  comment?: string;
  meta: {
    hotelId: number;
    hubId: number;
    hotelName: string;
    roomNumber: string;
    hubColor: string;
    hubName: string;
    cutlery?: boolean;
    foodCarrier?: {
      name: string;
    };
    dispatcher?: {
      id: number;
      name: string;
    };
  };
  scheduledDate?: string;
  type: ORDER_TYPE;
  paymentType: PaymentType;
  tip?: number;
  // TODO: remove any
  products: any[];
  version?: number;
  vouchers?: OrderVoucherItem[];
  totalVoucherPrice?: number;
  tax: number;
  totalNet: number;
  totalGross: number;
  grandTotal: number;
};

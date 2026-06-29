import type { PayStatusPropsType } from "../ui/PayStatus";
import { type DeliveryCompanyRus, type DeliveryCompanyType } from "./ApiEnums";
import type { CustomerData, Demisions, Order } from "./Order";

export type DeliveryStatus =
  | "new"
  | "calculation_of_cost"
  | "payment_in_russia"
  | "make_invoices"
  | "send"
  | "won"
  | "error";

export interface Delivery {
  actual_bx_status: DeliveryStatus;
  bx_id: number;
  comment: string | null;
  created_at: string;
  customer_personal_data: CustomerData | null;
  declared_value: number;
  delivery_company: string;
  description: string;
  dimensions: Demisions | null;
  id: string;
  lattice: boolean;
  orders: Order[];
  package_type: DeliveryPackageType;
  paid: boolean;
  price: number | null;
  tracking_number: string | null;
  user_id: string;
}

export type DeliveryPaymentError = {
  detail: {
    code: number;
    status: "error";
    error: "ERROR_ORDER_PAYMENT_BALANCE_INSUFFICIENT" | string;
    data: null;
  };
};

export const PACKAGE_VARIANTS = [
  {
    key: "no_package",
    value: "без упаковки(по городу)",
  },
  {
    key: "scotch_and_tape",
    value: "скотч + плёнка",
  },
  {
    key: "scotch_and_tape_and_box",
    value: "скотч + плёнка + коробка",
  },
] as const;

export type DeliveryPackageType = (typeof PACKAGE_VARIANTS)[number]["key"];

export interface CreateDelivery {
  type: DeliveryCompanyRus;
  package: DeliveryPackageType;
  description: string;
  first_name: string;
  last_name: string;
  patronymic_name?: string;
  phone_number: string;
  full_address: string;
  declared_value: number;
  lattice: boolean;
  orders_cn: Order[];
}

export const COMPANIES_LOGOS: Record<DeliveryCompanyType, string | null> = {
  VLADIVOSTOK: null,
  PP_USURIYSK: null,
  SDEK: "sdek.png",
  MAIL: "russianpost.png",
  MAIL_100SP: '100sp.svg',
  PEK: "pek.png",
  DEL_LINE: "dellin.png",
  ENERGIYA: "energia.png",
  BAIKAL: null,
  ANOTHER: null,
  "": null,
} as const;

export const DELIVERY_STATUSES: Record<DeliveryStatus, PayStatusPropsType> = {
  new: {
    color: "red",
    text: "Новый",
  },
  calculation_of_cost: {
    color: "orange",
    text: "Рассчет габаритов и стоимости",
  },
  payment_in_russia: {
    color: "orange",
    text: "Ожидает оплаты",
  },
  make_invoices: {
    color: "orange",
    text: "Ожидание отправки",
  },
  send: {
    color: "green",
    text: "Отправлено",
  },
  won: {
    color: "green",
    text: "Доставлено",
  },
  error: {
    color: "red",
    text: "Ошибка",
  },
};

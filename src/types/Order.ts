import type { PayStatusPropsType } from "../ui/PayStatus";
import type { BxStatuses } from "./BxStatuses";

export type CustomerData = {
  id: number;
  order_id: string;
  last_name: string;
  first_name: string;
  patronymic_name: string;
  full_address: string;
  city: string;
  postcode: string;
  region: string;
  phone_number: string;
  email: string;
  passport_series: string;
  passport_number: string;
  passport_issue_date: string;
  inn: string;
  created_at: Date;
};

export type Demisions = {
  id: number;
  dobropost_order_id: string;
  delivery_order_id: string;
  weight: number;
  width: number;
  height: number;
  length: number;
  created_at: Date;
};

export interface Order {
  id: string;
  bx_id: number;
  user_id: string;
  description: string;
  price: number;
  paid: false;
  seo_description: string;
  customs_description: string;
  count: number;
  cost_per_good: number;
  product_url: string;
  img_url: string;
  cn_tracking_number: string;
  dobropost_id: number;
  dobropost_tracking_number: string;
  dobropost_status: string | null;
  actual_bx_status: BxStatuses;
  created_at: Date;
  customer_personal_data: CustomerData;
  dimensions: Demisions;
}

export const ORDER_STATUSES: Record<
  Order["actual_bx_status"],
  PayStatusPropsType
> = {
  new: {
    color: "gray",
    text: "Новый",
  },
  error: {
    color: "red",
    text: "Ошибка",
  },
  data_send: {
    color: "orange",
    text: "Данные отправлены",
  },
  china_storage: {
    color: "orange",
    text: "Склад в Китае",
  },
  shipped_to_russia: {
    color: "green",
    text: "Отправлено в Россию",
  },
  pvz: {
    color: "green",
    text: "Отправлено в ПВЗ",
  },
  pickup: {
    color: "green",
    text: "Отправлено на самовывоз",
  },
  outwardly: {
    color: "green",
    text: "Отправлено из ПВЗ",
  },
  send_to_russia: {
    color: "green",
    text: "Отправлено в Россию",
  },
  collected: {
    color: "green",
    text: "Собрано",
  },
  export: {
    color: "orange",
    text: "Экспортировано",
  },
  destruction: {
    color: "red",
    text: "Уничтожено",
  },
  won: {
    color: "green",
    text: "Выполнено",
  },
};

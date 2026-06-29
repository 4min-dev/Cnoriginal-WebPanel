import type { DeliveryStatus } from "../../../types/Delivery";

export function getDeliveryStatusRus(deliveryStatus: DeliveryStatus): string {
  switch (deliveryStatus) {
    case "new":
      return "Новый";
    case "calculation_of_cost":
      return "Расчёт стоимости";
    case "payment_in_russia":
      return "Оплата";
    case "make_invoices":
      return "Создание счёта";
    case "send":
      return "Отправка";
    case "won":
      return "Выполнено";
    default:
      return "";
  }
}

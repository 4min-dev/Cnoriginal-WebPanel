const DELIVERY_PAYMENT_ERROR_MESSAGES: Record<string, string> = {
  ERROR_ORDER_PAYMENT_BALANCE_INSUFFICIENT: "Недостаточно средств на балансе",
  ERROR_DELIVERY_ORDER_PAYMENT_PRICE_NOT_SET:
    "Стоимость доставки еще не рассчитана",
  ERROR_DELIVERY_ORDER_PAID: "Доставка уже оплачена",
  ERROR_ORDER_STATUS_FAILED: "Доставка пока не готова к оплате",
  ERROR_DELIVERY_ORDER_NOT_FOUND: "Доставка не найдена",
};

export const getDeliveryPaymentErrorMessage = (
  error?: string | null,
  code?: number,
) => {
  if (error && DELIVERY_PAYMENT_ERROR_MESSAGES[error]) {
    return DELIVERY_PAYMENT_ERROR_MESSAGES[error];
  }

  return `При оплате произошла ошибка${code ? ` ${code}` : ""}`;
};

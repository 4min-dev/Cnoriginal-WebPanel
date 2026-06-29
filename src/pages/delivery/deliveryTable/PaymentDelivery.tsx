import { useEffect } from "react";
import { usePayDeliveryOrderMutation } from "../../../redux/services/deliveryService";
import type { DeliveryPaymentError } from "../../../types/Delivery";
import DefaultBtn from "../../../ui/DefaultBtn";
import LHeading from "../../../ui/text/LHeading";
import { getPiceStr } from "../utils/getPiceStr";
import { useDeliveryTable } from "../../../context/DeliveryTableContext";
import { getDeliveryPaymentErrorMessage } from "../utils/getDeliveryPaymentErrorMessage";

const PaymentDelivery: React.FC = () => {
  const { currentDeliveryOpen: delivery, setStatusPaymentPopup } =
    useDeliveryTable();

  const [payDeliveryOrder, { isLoading, error, data }] =
    usePayDeliveryOrderMutation();

  const paymentError =
    error && "data" in error ? (error.data as DeliveryPaymentError) : null;

  useEffect(() => {
    if (paymentError) {
      setStatusPaymentPopup({
        type: "error",
        text: getDeliveryPaymentErrorMessage(
          paymentError.detail?.error,
          paymentError.detail?.code,
        ),
        btnText: "Хорошо",
      });
    }
  }, [paymentError, setStatusPaymentPopup]);

  useEffect(() => {
    if (data?.data.status === "paid") {
      setStatusPaymentPopup({
        type: "success",
        text: "Оплачено",
        btnText: "Хорошо",
      });
    }
  }, [data, setStatusPaymentPopup]);

  return (
    <div className="rounded-[24px] bg-white">
      <LHeading
        level={3}
        className="mb-4 sm:mb-6"
      >
        Оплата
      </LHeading>
      {/* <div className="flex justify-between items-center mb-6">
                  <span className="text-[#B9B9B9] font-medium text-[16px]">
                    Общая цена
                  </span>

                  <hr className="mx-5" />
                  <span className="text-[#ED0028] text-semibold">
                    {delivery?.price} ₽
                  </span>
                </div> */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[#B9B9B9] font-medium text-[16px]">К оплате</p>
          <LHeading
            level={3}
            className="sm:mb-0"
          >
            {getPiceStr(delivery?.price ?? 0)}
          </LHeading>
        </div>

        {delivery && (
          <DefaultBtn
            onClick={() => payDeliveryOrder(delivery.id)}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            Оплатить заказ
          </DefaultBtn>
        )}
      </div>
    </div>
  );
};
export default PaymentDelivery;

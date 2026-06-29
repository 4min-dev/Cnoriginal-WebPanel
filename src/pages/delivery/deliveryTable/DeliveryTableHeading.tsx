import React, { useEffect } from "react";
import SearchInput from "../../../ui/SearchInput";
import LHeading from "../../../ui/text/LHeading";
import { LucidePlus } from "lucide-react";
import DefaultBtn from "../../../ui/DefaultBtn";
import { useDeliveryTable } from "../../../context/DeliveryTableContext";
import { usePayAllDeliveriesMutation } from "../../../redux/services/deliveryService";
import type { DeliveryPaymentError } from "../../../types/Delivery";
import PayIcon from "../../../ui/icons/PayIcon";
import { getDeliveryPaymentErrorMessage } from "../utils/getDeliveryPaymentErrorMessage";

type Props = {
  deliveryCreateClick: () => void;
  onSearch: (searchTerm: string) => void;
  canCreateDelivery: boolean;
};

const DeliveryTableHeading: React.FC<Props> = ({
  deliveryCreateClick,
  onSearch,
  canCreateDelivery,
}) => {
  const { setStatusPaymentPopup } = useDeliveryTable();

  const [payAllDeliveries, { isLoading, error, data }] =
    usePayAllDeliveriesMutation();

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
    if (data) {
      setStatusPaymentPopup({
        type: "success",
        text: "Все доставки успешно оплачены",
        btnText: "Хорошо",
      });
    }
  }, [data, setStatusPaymentPopup]);

  return (
    <div className="flex flex-col lg:mt-[20px] lg:pr-[24px] lg:pl-[24px] mt-[32px] pr-[16px] pl-[16px]">
      <LHeading level={1}>Доставка</LHeading>

      <div className="flex justify-between mt-[16px] flex-wrap lg:flex-nowrap w-full">
        <div className="flex lg:gap-x-[8px] lg:gap-y-[8px] gap-x-[8px] gap-y-[8px] flex-wrap lg:flex-nowrap w-full">
          <DefaultBtn
            isLoading={isLoading}
            className="gap-2"
            type="button"
            variant="outline"
            onClick={() => payAllDeliveries("")}
          >
            <PayIcon></PayIcon>
            Оплатить все
          </DefaultBtn>

          <SearchInput
            onChange={onSearch}
            placeholder="Поиск"
            className="lg:w-[287px] w-full lg:order-none"
          />
        </div>

        <DefaultBtn
          onClick={deliveryCreateClick}
          variant="primary"
          className="lg:w-[168px] w-full mt-[8px] lg:mt-0"
          disabled={!canCreateDelivery}
        >
          <LucidePlus className="lg:w-[24px] lg:h-[24px] w-[20px] h-[20px]" />
          Новый заказ
        </DefaultBtn>
      </div>
    </div>
  );
};

export default DeliveryTableHeading;

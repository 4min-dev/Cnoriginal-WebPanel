import { useState } from "react";
import DeliveryOrderItem from "./DeliveryOrderItem";
import DefaultBtn from "../../../ui/DefaultBtn";

interface Props {
  orders: any[]; // при наличии типа — подставь свой Order
}

const DeliveryOrdersList: React.FC<Props> = ({ orders }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleOrders = showAll ? orders : orders.slice(0, 4);

  if (!orders.length) {
    return <p>Заказы не выбраны</p>;
  }

  return (
    <>
      {visibleOrders.map((order) => (
        <DeliveryOrderItem
          key={order.id}
          order={order}
          variant={2}
        />
      ))}

      {orders.length > 4 && (
        <DefaultBtn
          variant="outline"
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-2"
        >
          {showAll ? "Скрыть" : "Показать все"}
        </DefaultBtn>
      )}
    </>
  );
};

export default DeliveryOrdersList;

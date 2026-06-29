import DeliveryCreateOrderList from "./DeliveryCreateOrderList";
import ErrorDisplay from "../../../ui/ErrorDisplay";
import { useDeliveryCreate } from "../../../context/DeliveryCreateContext";

const DeliveryCreateChoice: React.FC = () => {
  const { ordersError } = useDeliveryCreate();

  return (
    <div>
      {ordersError ? (
        <ErrorDisplay title="При загрузке заказов произошла ошибка" />
      ) : (
        <DeliveryCreateOrderList />
      )}
    </div>
  );
};

export default DeliveryCreateChoice;

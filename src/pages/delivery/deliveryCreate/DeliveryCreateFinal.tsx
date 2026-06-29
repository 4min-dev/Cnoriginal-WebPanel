import DefaultCard from "../../../ui/cards/DefaultCard";
import LHeading from "../../../ui/text/LHeading";
import TextField from "../../../ui/text/TextField";
import { useDeliveryCreate } from "../../../context/DeliveryCreateContext";
import DefaultBtn from "../../../ui/DefaultBtn";

import { Pencil } from "lucide-react";
import Checkbox from "../../../ui/Checkbox";
import { useCreateDeliveryOrderMutation } from "../../../redux/services/deliveryService";
import isMobileDevice from "../../../assets/isMobileDevice";
import DeliveryParams from "../ui/DeliveryParams";
import DeliveryOrdersList from "../ui/DeliveryOrdersList";

const DeliveryCreateFinal: React.FC = () => {
  const {
    selectedOrdersIds,
    currentOrders,
    formData,
    fullAddress,
    setCurrentStep,
    confirmedCorrect,
    setConfirmedCorrect,
  } = useDeliveryCreate();

  const isMobile = isMobileDevice();

  const [, { isLoading }] = useCreateDeliveryOrderMutation();

  const selectedOrders = currentOrders.filter((order) =>
    selectedOrdersIds.includes(order.id),
  );

  return (
    <div className="flex flex-col gap-6">
      <DefaultCard className="gap-6">
        <LHeading level={3}>Выбранные заказы</LHeading>

        <DeliveryOrdersList orders={selectedOrders} />
      </DefaultCard>

      <DefaultCard className="gap-5">
        <div className="flex items-center justify-between">
          <LHeading level={3}>Получатель</LHeading>

          <DefaultBtn
            adaptive={true}
            onClick={() => setCurrentStep(1)}
            variant="outline"
            className="max-w-[180px] gap-2"
            disabled={isLoading}
          >
            {isMobile ? "" : "Редактировать"}
            <Pencil size={18} />
          </DefaultBtn>
        </div>

        <TextField
          title="ФИО"
          value={formData.fio || "-"}
        />
        <TextField
          title="Телефон"
          value={formData.phone || "-"}
        />
        <TextField
          title="Адрес"
          value={fullAddress || "-"}
        />
      </DefaultCard>

      <DeliveryParams data={formData} />

      <label
        htmlFor="confirm-data"
        className="flex gap-2 items-center"
      >
        <Checkbox
          id="confirm-data"
          checked={confirmedCorrect}
          onChange={() => setConfirmedCorrect(!confirmedCorrect)}
          disabled={isLoading}
        />
        Подтверждаю корректность данных
      </label>

      <hr className="mx-3 sm:mx-3" />
    </div>
  );
};

export default DeliveryCreateFinal;

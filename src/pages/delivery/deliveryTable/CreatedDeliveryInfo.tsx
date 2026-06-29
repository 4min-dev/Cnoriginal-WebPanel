import { useEffect, useState } from "react";
import { DELIVERY_STATUSES } from "../../../types/Delivery";
import SideDrawer from "../../../ui/popup/SideDrawer";
import DeliveryParams from "../ui/DeliveryParams";
import LHeading from "../../../ui/text/LHeading";
import DeliveryOrdersList from "../ui/DeliveryOrdersList";
import DefaultCard from "../../../ui/cards/DefaultCard";
import TextField from "../../../ui/text/TextField";
import { formatIsoToRu } from "../../../utils/dates/formatIsoToRu";
import { formatFioFull } from "../../../utils/text/formatFioFull";
import CopyText from "../../../ui/text/CopyText";
import PayStatus from "../../../ui/PayStatus";
import PaymentDelivery from "./PaymentDelivery";
import { useDeliveryTable } from "../../../context/DeliveryTableContext";

export const CreatedDeliveryInfo: React.FC = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);

  const { currentDeliveryOpen: delivery, setCurrentDeliveryOpen } =
    useDeliveryTable();

  useEffect(() => {
    // когда мы выбрали доставку, открываем попап через setIsOpenDrawer
    if (delivery) {
      setTimeout(() => {
        setIsOpenDrawer(true);
      }, 1);
    }
  }, [delivery, setIsOpenDrawer]);

  useEffect(() => {
    // когда мы закрываем попап, удаляем текущую доставку через setCurrentDeliveryOpen
    if (!isOpenDrawer) {
      setTimeout(() => {
        setCurrentDeliveryOpen(null);
      }, 150);
    }
  }, [isOpenDrawer, setCurrentDeliveryOpen]);

  return (
    <div>
      <SideDrawer
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
      >
        {delivery && (
          <div className="flex flex-col gap-4 p-4 pr-12 sm:gap-5 sm:p-6 sm:pr-14">
            <div className="flex flex-col gap-2 pr-2 sm:flex-row sm:items-center sm:gap-4">
              <LHeading
                level={3}
                className="leading-tight"
              >
                Доставка №{delivery.id.slice(-10)}
              </LHeading>

              <PayStatus
                className="hidden shrink-0 sm:block"
                variant="full"
                status={delivery.actual_bx_status}
                statusesSettings={DELIVERY_STATUSES}
              />
              <PayStatus
                className="block w-fit sm:hidden"
                variant="short"
                status={delivery.actual_bx_status}
                statusesSettings={DELIVERY_STATUSES}
              />
            </div>

            {delivery.tracking_number && (
              <CopyText text={`# ${delivery.tracking_number}`}></CopyText>
            )}

            <DefaultCard className="gap-4 sm:gap-5">
              <LHeading level={3}>Основное</LHeading>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <TextField
                  title="Дата создания"
                  variant="input"
                  value={
                    delivery.created_at
                      ? formatIsoToRu(delivery.created_at)
                      : "-"
                  }
                ></TextField>
                <TextField
                  title="Количество заказов"
                  variant="input"
                  value={delivery?.orders?.length || ""}
                ></TextField>
                <TextField
                  title="Общий вес (кг)"
                  variant="input"
                  value={
                    delivery?.dimensions?.weight
                      ? `${delivery?.dimensions?.weight / 1000} кг`
                      : "-"
                  }
                ></TextField>
                <TextField
                  title="Габариты(см)"
                  variant="input"
                  value={
                    delivery?.dimensions
                      ? `${delivery?.dimensions?.width} x ${delivery?.dimensions?.height} x ${delivery?.dimensions?.length}`
                      : "-"
                  }
                ></TextField>
              </div>
            </DefaultCard>

            <DefaultCard className="gap-4 sm:gap-5">
              <LHeading level={3}>Получатель</LHeading>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="sm:col-span-2">
                  <TextField
                    title="ФИО"
                    variant="input"
                    value={formatFioFull(
                      delivery?.customer_personal_data?.first_name || "",
                      delivery?.customer_personal_data?.last_name || "",
                      delivery?.customer_personal_data?.patronymic_name || "",
                    )}
                  ></TextField>
                </div>
                <TextField
                  title="Телефон"
                  variant="input"
                  value={delivery.customer_personal_data?.phone_number || "-"}
                ></TextField>
                <div className="relative">
                  <TextField
                    title="Адрес"
                    variant="input"
                    className="!block !truncate !leading-[44px]"
                    value={delivery?.customer_personal_data?.full_address || "-"}
                  />
                  {delivery?.customer_personal_data?.full_address && (
                    <div
                      className="absolute inset-0 cursor-help"
                      title={delivery.customer_personal_data.full_address}
                    />
                  )}
                </div>
              </div>
            </DefaultCard>

            <DeliveryParams data={delivery as any}>
              <TextField
                title="Статус"
                variant="text"
                value={DELIVERY_STATUSES[delivery.actual_bx_status].text || "-"}
              ></TextField>
            </DeliveryParams>

            <DefaultCard className="gap-3 sm:gap-4">
              <LHeading level={3}>Заказы в доставке</LHeading>
              <DeliveryOrdersList orders={delivery.orders}></DeliveryOrdersList>
            </DefaultCard>

            <hr className="_solid my-1 sm:my-2" />

            {delivery.actual_bx_status === "payment_in_russia" && (
              <PaymentDelivery></PaymentDelivery>
            )}
          </div>
        )}
      </SideDrawer>
    </div>
  );
};

export default CreatedDeliveryInfo;

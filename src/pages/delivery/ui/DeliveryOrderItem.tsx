import { ORDER_STATUSES, type Order } from "../../../types/Order";
import Checkbox from "../../../ui/Checkbox";
import BoxSvg from "../../../../public/images/box.svg";
import PayStatus from "../../../ui/PayStatus";

type Props = {
  order: Order;
  checked?: boolean;
  onCheckChange?: (orderId: string, checked: boolean) => void;
  variant?: 1 | 2;
};

const DeliveryOrderItem: React.FC<Props> = ({
  order,
  checked = false,
  onCheckChange,
  variant = 1,
}) => {
  const isViewMode = variant === 2;

  const handleCheckboxChange = (newChecked: boolean) => {
    if (onCheckChange) {
      onCheckChange(order.id, newChecked);
    }
  };

  return (
    <div
      className={`flex flex-col justify-between gap-3 border-b border-[#D7D7D7] last:border-b-0 sm:flex-row sm:gap-6 ${
        isViewMode ? "px-0 py-3 last:pb-0" : "px-2 py-3 sm:px-0"
      }`}
    >
      <div className="flex gap-3 items-start">
        {variant === 1 && (
          <Checkbox
            className="mt-1"
            checked={checked}
            onChange={handleCheckboxChange}
          />
        )}

        <img
          className="h-10 w-10 min-w-[40px] rounded-lg border border-[#e4e4e4] object-cover"
          src={order.img_url || BoxSvg}
          alt="order img"
          onError={(e) => {
            e.currentTarget.src = BoxSvg;
          }}
        />

        <div className="min-w-0">
          <p className="text-[#333] text-sm sm:text-[16px] font-medium truncate">
            #{order.id}
          </p>
          <p className="text-[#B3B3B3] text-xs sm:text-sm line-clamp-2">
            {order.description}
          </p>
        </div>
      </div>

      <hr className="block sm:hidden" />

      <div
        className={`flex justify-between gap-4 text-sm sm:justify-end sm:gap-8 ${
          isViewMode ? "pl-[52px] pr-0 sm:pl-0" : "pl-10 pr-8 sm:pl-0 sm:pr-0"
        }`}
      >
        <div className="sm:w-full w-1/2 flex flex-col">
          <p className="text-[#B3B3B3] text-xs sm:text-[14px]">Вес (кг)</p>

          <p className="font-medium">
            {order.dimensions?.weight
              ? (order.dimensions?.weight / 1000).toFixed(2)
              : "-"}
          </p>
        </div>

        <div className=" sm:w-full w-1/2 flex flex-col items-start">
          <p className="text-[#B3B3B3] text-xs sm:text-[14px]">Стоимость</p>
          <div className="flex gap-2 items-center font-medium text-nowrap">
            {order?.price?.toLocaleString() || ""} ₽
            {variant === 1 && (
              <PayStatus
                statusesSettings={ORDER_STATUSES}
                variant="short"
                status={order.actual_bx_status}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeliveryOrderItem;

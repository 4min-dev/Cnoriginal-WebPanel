import type { Order } from "../../../types/Order";
import Checkbox from "../../../ui/Checkbox";
import DeliveryPayStatus from "../ui/DeliveryPayStatus";
import BoxSvg from "../../../../public/images/box.svg";

type Props = {
  order: Order;
  checked?: boolean;
  onCheckChange?: (orderId: string, checked: boolean) => void;
  variant?: 1 | 2;
};

const DeliveryCreateOrderItem: React.FC<Props> = ({
  order,
  checked = false,
  onCheckChange,
  variant = 1,
}) => {
  const handleCheckboxChange = (newChecked: boolean) => {
    if (onCheckChange) {
      onCheckChange(order.id, newChecked);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-6 border-b border-[#D7D7D7] py-3 px-2 sm:px-0">
      <div className="flex gap-3 items-start">
        {variant === 1 && (
          <Checkbox
            className="mt-1"
            checked={checked}
            onChange={handleCheckboxChange}
          />
        )}

        <img
          className="w-10 h-10 min-w-[40px] border border-[#e4e4e4] rounded-lg object-cover"
          src={order.img_url}
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

      <div className="flex justify-between sm:justify-end gap-4 sm:gap-8 text-sm ms:pl-0 pl-10 sm:pr-0 pr-8">
        <div className="">
          <p className="text-[#B3B3B3] text-xs sm:text-[14px]">Вес (кг)</p>

          <p className="font-medium">
            {/* @ts-ignore */}
            {(order.dimensions && order.dimensions[0].weight) || "-"}
          </p>
        </div>

        <div className=" sm:w-full w-1/2 flex flex-col items-start">
          <p className="text-[#B3B3B3] text-xs sm:text-[14px]">Стоимость</p>
          <p className="flex gap-2 items-center font-medium">
            {order?.price?.toLocaleString() || ""} ₽
            {variant === 1 && <DeliveryPayStatus status="new" />}
          </p>
        </div>
      </div>
    </div>
  );
};
export default DeliveryCreateOrderItem;

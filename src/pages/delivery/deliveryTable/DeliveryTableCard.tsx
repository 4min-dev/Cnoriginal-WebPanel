import React, { useState } from "react";
import { DELIVERY_STATUSES, type Delivery } from "../../../types/Delivery";
import { ChevronDown, EllipsisVertical } from "lucide-react";
import { formatIsoToRu } from "../../../utils/dates/formatIsoToRu";
import TruncatedWithHover from "../../../ui/text/TruncatedWithHover";
import { formatFioShort } from "../../../utils/text/formatFioShort";
import DeliveryCompanyImg from "../ui/DeliveryCompanyImg";
import PayStatus from "../../../ui/PayStatus";
import { getPiceStr } from "../utils/getPiceStr";

type DeliveryCardProps = {
  delivery: Delivery;
  openDelivery: () => void;
};

const DeliveryCard: React.FC<DeliveryCardProps> = ({
  delivery,
  openDelivery,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleCardClick() {
    setIsOpen((prev) => !prev);
  }

  const PaymentStatuses = () => (
    <PayStatus
      variant="short"
      statusesSettings={DELIVERY_STATUSES}
      status={delivery.actual_bx_status}
    />
  );

  const mobileHidden = !isOpen ? "hidden lg:block" : "";

  return (
    <div
      className="
        flex flex-col gap-[16px] h-fit
        lg:grid lg:grid-cols-13 lg:gap-4 lg:h-[64px]
        lg:items-center
        px-[16px] py-[16px] lg:py-[21px]
        border-b last:border-b-0
        border-[#F3F3F3] lg:border-[#F2F2F2]
        shadow-[0_0_25.8px_0_#0f0f2b26] lg:shadow-none
        bg-white lg:bg-none
        rounded-[24px] lg:rounded-none
        lg:hover:bg-[#FAFAFA]
        transition-colors
      "
      onClick={handleCardClick}
    >
      {/* HEADER */}
      <div className="col-span-1 text-[18px] lg:text-sm font-medium text-[#333333] flex items-center gap-[12px]">
        {/* mobile button */}
        <button
          className="lg:hidden"
          onClick={(e) => {
            e.stopPropagation();
            openDelivery();
          }}
        >
          <EllipsisVertical />
        </button>

        {/* id */}
        <span className="lg:hidden text-[12px] text-gray-600 max-w-[50%]">
          {delivery.id}
        </span>

        <div className="hidden lg:block">
          <TruncatedWithHover
            text={delivery.id}
            maxLength={8}
          />
        </div>

        {/* mobile expand */}
        <div className="lg:hidden ml-auto flex items-center gap-[8px]">
          {!isOpen && PaymentStatuses()}
          <ChevronDown className={isOpen ? "rotate-180" : ""} />
        </div>
      </div>

      {/* Дата */}
      <div
        className={`col-span-2 ${mobileHidden} flex justify-between items-center lg:block`}
      >
        <span className="lg:hidden text-[#33333366]">Дата создания</span>
        {formatIsoToRu(delivery.created_at)}
      </div>

      {/* Получатель */}
      <div
        className={`col-span-2 ${mobileHidden} flex justify-between items-center lg:block`}
      >
        <span className="lg:hidden text-[#33333366]">Получатель</span>
        {formatFioShort(
          delivery.customer_personal_data?.first_name || "",
          delivery.customer_personal_data?.last_name || "",
          delivery.customer_personal_data?.patronymic_name || "",
        )}
      </div>

      {/* Город */}
      <div
        className={`col-span-2 ${mobileHidden} flex justify-between items-center lg:block`}
      >
        <span className="lg:hidden text-[#33333366]">Город</span>
        {delivery.customer_personal_data?.full_address.split(",")[0]}
      </div>

      {/* ТК */}
      <div
        className={`col-span-1 ${mobileHidden} flex justify-between items-center lg:block`}
      >
        <span className="lg:hidden text-[#33333366]">ТК</span>
        <DeliveryCompanyImg deliveryCompany={delivery.delivery_company} />
      </div>

      {/* Трек */}
      <div
        className={`col-span-2 ${mobileHidden} flex justify-between items-center lg:block`}
      >
        <span className="lg:hidden text-[#33333366]">Трек-номер</span>
        {delivery.tracking_number || "-"}
      </div>

      {/* Цена */}
      <div className={`col-span-2 ${mobileHidden} flex items-center`}>
        {/* mobile */}
        <div className="lg:hidden flex justify-between w-full">
          <span className="text-[#33333366]">Стоимость</span>
          <div className="flex gap-[8px]">
            {getPiceStr(delivery.price)}
            {PaymentStatuses()}
          </div>
        </div>

        {/* desktop */}
        <div className="hidden lg:flex items-center gap-[8px]">
          {getPiceStr(delivery.price)}
          {PaymentStatuses()}
        </div>
      </div>

      {/* desktop button */}
      <div className="hidden lg:block col-span-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openDelivery();
          }}
        >
          <EllipsisVertical />
        </button>
      </div>
    </div>
  );
};

export default DeliveryCard;

const DeliveryTableHeader: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={`grid grid-cols-13 gap-4 h-[48px] items-center mt-6 px-4 bg-[#F4F4F4] border-b border-[#F3F3F3] rounded-[8px] ${className}`}
    >
      <div className="col-span-1 text-[16px] opacity-60 font-medium text-[#333333] flex items-center gap-[5px]">
        ID Доставки
      </div>
      <div className="col-span-2 text-[16px] opacity-60 font-medium text-[#333333]">
        Дата создания
      </div>
      <div className="col-span-2 text-[16px] opacity-60 font-medium text-[#333333]">
        Получатель
      </div>
      <div className="col-span-2 text-[16px] opacity-60 font-medium text-[#333333]">
        Город
      </div>
      <div className="col-span-1 text-[16px] opacity-60 font-medium text-[#333333]">
        ТК
      </div>
      <div className="col-span-2 text-[16px] opacity-60 font-medium text-[#333333]">
        Трек-номер
      </div>
      <div className="col-span-2 text-[16px] opacity-60 font-medium text-[#333333]">
        Стоимость
      </div>
    </div>
  );
};

export default DeliveryTableHeader;

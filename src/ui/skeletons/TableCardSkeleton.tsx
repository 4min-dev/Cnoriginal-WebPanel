import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DeliveryCardSkeleton: React.FC = () => {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-4 lg:h-[64px] flex lg:items-center px-4 py-4 border-b border-[#F3F3F3] shadow-[0_0_25.8px_0_#0f0f2b26] lg:shadow-none bg-white lg:bg-none rounded-[24px] lg:rounded-[0px] mb-4">
      {/* ID и иконка */}
      <div className="col-span-1 flex items-center gap-2">
        <Skeleton
          width={60}
          height={20}
        />
      </div>

      {/* Дата создания */}
      <div className="col-span-2 flex items-center">
        <Skeleton
          width={80}
          height={16}
        />
      </div>

      {/* Получатель */}
      <div className="col-span-2 flex items-center">
        <Skeleton
          width={120}
          height={16}
        />
      </div>

      {/* Город */}
      <div className="col-span-2 flex items-center">
        <Skeleton
          width={100}
          height={16}
        />
      </div>

      {/* ТК */}
      <div className="col-span-1 flex items-center">
        <Skeleton
          width={60}
          height={16}
        />
      </div>

      {/* Трек-номер */}
      <div className="col-span-2 flex items-center">
        <Skeleton
          width={140}
          height={16}
        />
      </div>

      {/* Стоимость + статус */}
      <div className="col-span-2 flex items-center gap-2">
        <Skeleton
          width={80}
          height={16}
        />
        <Skeleton
          width={40}
          height={16}
        />
      </div>
    </div>
  );
};

export default DeliveryCardSkeleton;

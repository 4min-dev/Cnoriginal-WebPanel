import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SmCardSkeleton: React.FC = () => {
  return (
    <div className="flex gap-8 justify-between items-center py-[12px] mb-4 pe-12">
      <div className="flex gap-2 items-center">
        <Skeleton
          width={40}
          height={40}
          borderRadius={8}
        />

        <div>
          <Skeleton
            width={80}
            height={16}
            className="mb-1"
          />
          <Skeleton
            width={140}
            height={14}
          />
        </div>
      </div>

      <div className="ms-auto">
        <Skeleton
          width={60}
          height={14}
          className="mb-1"
        />
        <Skeleton
          width={40}
          height={16}
        />
      </div>

      <div>
        <Skeleton
          width={80}
          height={14}
          className="mb-1"
        />
        <div className="flex items-center gap-2">
          <Skeleton
            width={70}
            height={16}
          />
        </div>
      </div>
    </div>
  );
};

export default SmCardSkeleton;

import React, { useMemo, useState, useEffect } from "react";
import DeliveryCard from "./DeliveryTableCard";
import TableCardSkeleton from "../../../ui/skeletons/TableCardSkeleton";
import { useAppSelector } from "../../../hooks/useAppDispatch";
import { useGetDeliveryOrdersQuery } from "../../../redux/services/deliveryService";
import EmptyDeliveries from "./EmptyDeliveries";
import DeliveryTableHeader from "./DeliveryTableHeader";
import DeliveryTableHeading from "./DeliveryTableHeading";
import DeliveryFilters, {
  type DeliveryTableTabName,
} from "./DeliveryTableFilters";
import type { Delivery } from "../../../types/Delivery";
import CreatedDeliveryInfo from "./CreatedDeliveryInfo";
import StatusPopup from "../../../ui/popup/StatusPopup";
import { useDeliveryTable } from "../../../context/DeliveryTableContext";

const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

type Props = {
  deliveryCreateClick: () => void;
  canCreateDelivery: boolean;
};

const DeliveryTable: React.FC<Props> = ({
  deliveryCreateClick,
  canCreateDelivery,
}) => {
  const isAuthenticated = useAppSelector(
    (state) => state?.auth.isAuthenticated,
  );
  const accessToken = useAppSelector((state) => state?.auth.accessToken);

  const { statusPaymentPopup, setStatusPaymentPopup, setCurrentDeliveryOpen } =
    useDeliveryTable();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // задержка 300 мс

  const {
    data: deliveries,
    isLoading,
    error,
  } = useGetDeliveryOrdersQuery(undefined, {
    skip: !isAuthenticated || !accessToken,
  });

  const isShowSkeletons = isLoading || !isAuthenticated || !accessToken;

  const [activeTab, setActiveTab] =
    React.useState<DeliveryTableTabName>("active");

  const filteredDeliveries = useMemo<Delivery[]>(() => {
    if (!deliveries?.data?.delivery) return [];

    let filtered = deliveries.data.delivery;

    if (activeTab === "delivered") {
      filtered = filtered.filter((d) => d.actual_bx_status === "won");
    } else {
      filtered = filtered.filter((d) => d.actual_bx_status !== "won");
    }

    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (delivery) =>
          String(delivery.id).toLowerCase().includes(term) ||
          (delivery.tracking_number?.toLowerCase() || "").includes(term) ||
          delivery.description.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [deliveries, activeTab, debouncedSearchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <>
      {statusPaymentPopup && (
        <StatusPopup
          setShowPopup={() => setStatusPaymentPopup(null)}
          title={statusPaymentPopup.type === "error" ? "Ошибка" : "Успех"}
          text={statusPaymentPopup.text}
          status={statusPaymentPopup.type}
          btnText="Хорошо"
        ></StatusPopup>
      )}
      <CreatedDeliveryInfo />

      <DeliveryTableHeading
        deliveryCreateClick={deliveryCreateClick}
        onSearch={handleSearch}
        canCreateDelivery={canCreateDelivery}
      />

      <DeliveryFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="w-full flex flex-col gap-2 lg:block lg:px-6 px-4 pt-5 lg:pt-0">
        <DeliveryTableHeader className="hidden lg:grid" />

        {error && (
          <div className="text-red-500 p-4 text-center">
            Ошибка загрузки данных. Пожалуйста, попробуйте позже.
          </div>
        )}

        {isShowSkeletons &&
          Array.from({ length: 10 }).map((_, idx) => (
            <TableCardSkeleton key={idx} />
          ))}

        {filteredDeliveries.length === 0 &&
          !isShowSkeletons &&
          !error &&
          (searchTerm ? (
            <EmptyDeliveries
              title={"Не найдено"}
              message={`По запросу "${searchTerm}" ничего не найдено`}
            />
          ) : (
            <EmptyDeliveries />
          ))}

        {filteredDeliveries.map((delivery) => (
          <DeliveryCard
            key={delivery.id}
            delivery={delivery}
            openDelivery={() => setCurrentDeliveryOpen(delivery)}
          />
        ))}
      </div>
    </>
  );
};

export default DeliveryTable;

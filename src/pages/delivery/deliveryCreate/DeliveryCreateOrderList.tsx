import { useState, useMemo } from "react";
import DeliveryOrderItem from "../ui/DeliveryOrderItem";
import SearchInput from "../../../ui/SearchInput";
import "react-loading-skeleton/dist/skeleton.css";
import SmCardSkeleton from "../../../ui/skeletons/SmCardSkeleton";
import DefaultBtn from "../../../ui/DefaultBtn";
import DefaultTab from "../../../ui/DefaultTab";
import { DELIVERY_CREATE_CHOICE_TABS } from "../utils/deliveryCreateUtils";
import { useDeliveryCreate } from "../../../context/DeliveryCreateContext";
import { useAppSelector } from "../../../hooks/useAppDispatch";
import EmptyBlock from "../../../ui/popup/EmptyBlock";

const DeliveryCreateOrderList: React.FC = () => {
  const {
    currentOrders,
    selectedOrdersIds,
    setSelectedOrdersIds,
    activeTab,
    isOrdersLoading,
    setActiveTab,
  } = useDeliveryCreate();

  const isAuthenticated = useAppSelector(
    (state) => state?.auth.isAuthenticated,
  );
  const accessToken = useAppSelector((state) => state?.auth.accessToken);

  const isLoading = !isAuthenticated || !accessToken || isOrdersLoading;

  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return currentOrders;
    return currentOrders.filter((order) =>
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [currentOrders, searchTerm]);

  const handleCheckChange = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrdersIds([...selectedOrdersIds, orderId]);
    } else {
      setSelectedOrdersIds(selectedOrdersIds.filter((id) => id !== orderId));
    }
  };

  const currentTabSelectedIds = filteredOrders
    .map((item) => item.id)
    .filter((id) => selectedOrdersIds.includes(id));

  const toggleSelectAll = () => {
    const allSelected = filteredOrders.every((item) =>
      selectedOrdersIds.includes(item.id),
    );

    if (allSelected) {
      setSelectedOrdersIds(
        selectedOrdersIds.filter(
          (id) => !filteredOrders.some((o) => o.id === id),
        ),
      );
    } else {
      setSelectedOrdersIds([
        ...new Set([...selectedOrdersIds, ...filteredOrders.map((o) => o.id)]),
      ]);
    }
  };

  const selectedAll =
    currentTabSelectedIds.length === filteredOrders.length &&
    filteredOrders.length > 0;

  return (
    <div className="flex flex-col h-full">
      <DefaultTab
        className="mb-4 order-2 sm:order-1"
        tabs={[...DELIVERY_CREATE_CHOICE_TABS]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="order-1 sm:order-2 flex flex-col sm:flex-row gap-3 mb-4">
        <DefaultBtn
          className="w-full sm:w-auto lg:w-[150px]"
          variant={selectedAll ? "primary" : "outline"}
          onClick={toggleSelectAll}
          disabled={isLoading}
        >
          Выбрать все
        </DefaultBtn>

        <SearchInput
          placeholder="Поиск по заказам"
          value={searchTerm}
          onChange={setSearchTerm}
          className="w-full sm:max-w-[300px]"
        />
      </div>

      <div
        className="
        max-h-[350px]
          order-3 flex-1 overflow-y-auto
          scrollbar-gray
          pr-1
        "
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(51, 51, 51, .4) #F8F8F8",
        }}
      >
        {isLoading ? (
          <div className="flex flex-col gap-3 p-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SmCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredOrders.length === 0 && searchTerm ? (
          <div className="text-center text-[#B3B3B3] mt-4 px-2">
            По запросу "{searchTerm}" ничего не найдено
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyBlock title="Заказы отсутствуют"></EmptyBlock>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredOrders.map((item) => (
              <DeliveryOrderItem
                key={item.id}
                order={item}
                onCheckChange={handleCheckChange}
                checked={currentTabSelectedIds.includes(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryCreateOrderList;

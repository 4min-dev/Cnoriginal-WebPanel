// DeliveryFilters.tsx
import React from "react";
import DefaultTab, { type TabItem } from "../../../ui/DefaultTab";
import CheckCircleIcon from "../../../ui/icons/CheckCircleIcon";
import DeliveryTrackIcon from "../../../ui/icons/DeliveryTrackIcon";

export type DeliveryTableTabName = "active" | "delivered";

type Props = {
  activeTab: DeliveryTableTabName;
  setActiveTab: (id: DeliveryTableTabName) => void;
};

const DeliveryFilters: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabs: TabItem[] = [
    {
      id: "active",
      label: (
        <span className="flex gap-2">
          Активные <DeliveryTrackIcon />
        </span>
      ),
    },
    {
      id: "delivered",
      label: (
        <span className="flex gap-2">
          Доставленные <CheckCircleIcon />
        </span>
      ),
    },
  ];

  return (
    <div className="mt-[32px] pl-[24px] pr-[24px]">
      <DefaultTab
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default DeliveryFilters;

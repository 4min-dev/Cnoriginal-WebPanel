// DeliveryTabs.tsx
import React from "react";

export interface TabItem {
  id: string;
  label: React.ReactNode; // Текст или JSX
}

interface DeliveryTabsProps<T extends string> {
  tabs: TabItem[];
  activeTab: T;
  setActiveTab: (id: T) => void;
  className?: string; // Доп. класс для внешнего контейнера
}

const DefaultTab = <T extends string>({
  tabs,
  activeTab,
  setActiveTab,
  className,
}: DeliveryTabsProps<T>) => {
  return (
    <div
      className={`flex gap-5 justify-center [@media(min-width:390px)]:justify-start border-b-[2px] border-[#F2F2F2]  ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as T)}
            className={`flex items-center gap-2 pb-2 mb-[-2px] cursor-pointer transition ${
              isActive
                ? "border-b-3 border-red-500 text-[#ED0028]"
                : "border-b-3 border-transparent text-[#D7D7D7]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default DefaultTab;

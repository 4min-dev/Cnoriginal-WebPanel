import { createContext, useContext, useState, type ReactNode } from "react";
import type { Delivery } from "../types/Delivery";

type statusPopupState = {
  type: "success" | "error";
  text: string;
  btnText: string;
};

export type DeliveryTableContextType = {
  statusPaymentPopup: statusPopupState | null;
  setStatusPaymentPopup: React.Dispatch<
    React.SetStateAction<statusPopupState | null>
  >;
  currentDeliveryOpen: Delivery | null;
  setCurrentDeliveryOpen: React.Dispatch<React.SetStateAction<Delivery | null>>;
};

const DeliveryTableContext = createContext<DeliveryTableContextType | null>(
  null,
);

export const DeliveryTableProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [statusPaymentPopup, setStatusPaymentPopup] =
    useState<statusPopupState | null>(null);

  const [currentDeliveryOpen, setCurrentDeliveryOpen] =
    useState<null | Delivery>(null);

  return (
    <DeliveryTableContext.Provider
      value={{
        statusPaymentPopup,
        setStatusPaymentPopup,
        currentDeliveryOpen,
        setCurrentDeliveryOpen,
      }}
    >
      {children}
    </DeliveryTableContext.Provider>
  );
};

// Хук для использования контекста
// eslint-disable-next-line react-refresh/only-export-components
export const useDeliveryTable = () => {
  const ctx = useContext(DeliveryTableContext);
  if (!ctx) {
    throw new Error("useDeliveryCreate must be used within Provider");
  }
  return ctx;
};

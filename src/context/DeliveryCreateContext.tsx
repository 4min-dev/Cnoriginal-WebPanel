import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
  useEffect,
} from "react";
import { useAppSelector } from "../hooks/useAppDispatch";
import { useGetDobropostOrdersQuery } from "../redux/services/dobropostOrders";
import type { DELIVERY_CREATE_CHOICE_TABS } from "../pages/delivery/utils/deliveryCreateUtils";
import type { Order } from "../types/Order";
import { useGetProfileQuery } from "../redux/services/userService";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import type { DeliveryCompanyRus } from "../types/ApiEnums";
import type { DeliveryPackageType } from "../types/Delivery";

type TabId = (typeof DELIVERY_CREATE_CHOICE_TABS)[number]["id"];

export type DeliveryFormData = {
  fio: string;
  phone: string;
  city: string;
  street: string;
  house: string;
  postcode: string;
  flat: string;

  type: DeliveryCompanyRus;
  package: DeliveryPackageType;
  description: string;
  declared_value: number;
  lattice: boolean;
};

export type DeliveryCreateContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;

  selectedOrdersIds: string[];
  setSelectedOrdersIds: (ids: string[]) => void;

  formData: DeliveryFormData;
  setFormData: (data: Partial<DeliveryFormData>) => void;

  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  confirmedCorrect: boolean;
  setConfirmedCorrect: (val: boolean) => void;

  currentOrders: Order[];
  ordersError: FetchBaseQueryError | SerializedError | undefined;

  fullAddress: string;

  isOrdersLoading: boolean;
};

const DeliveryCreateContext = createContext<DeliveryCreateContextType | null>(
  null,
);

export const DeliveryCreateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOrdersIds, setSelectedOrdersIds] = useState<string[]>([]);

  const [confirmedCorrect, setConfirmedCorrect] = useState(false);

  const [formData, setFormDataState] = useState<DeliveryFormData>({
    fio: "",
    phone: "",
    city: "",
    street: "",
    house: "",
    postcode: "",
    flat: "",

    type: "Владивосток",
    package: "no_package",
    description: "",
    declared_value: 0,
    lattice: false,
  });

  const setFormData = (data: Partial<DeliveryFormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  const [activeTab, setActiveTab] = useState<TabId>("clients");

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const {
    data: orders,
    error,
    isLoading: isOrdersLoading,
  } = useGetDobropostOrdersQuery(undefined, {
    skip: !accessToken || !isAuthenticated,
  });

  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !accessToken || !isAuthenticated,
  });

  const { myOrders, clientsOrders } = useMemo(() => {
    const dobropost = orders?.data?.dobropost || [];

    const myOrders: Order[] = [];
    const clientsOrders: Order[] = [];
    dobropost.forEach((order) => {
      if (order.actual_bx_status !== "send_to_russia" || !order.paid) {
        return;
      }
      if (!order.customer_personal_data) {
        clientsOrders.push(order);

        return;
      }
      if (
        order.customer_personal_data.passport_number ===
        profile?.data.passport_number
      ) {
        myOrders.push(order);
      } else {
        clientsOrders.push(order);
      }
    });
    return {
      myOrders,
      clientsOrders,
    };
  }, [profile, orders]);

  const fullAddress = useMemo(() => {
    const addressParts = [
      formData.city,
      formData.street ? `ул. ${formData.street}` : undefined,
      formData.house ? `д. ${formData.house}` : undefined,
      formData.flat ? `кв. ${formData.flat}` : undefined,
    ].filter(Boolean);
    const fullAddress = addressParts.join(", ");

    return fullAddress;
  }, [formData]);

  const currentOrders = activeTab === "clients" ? clientsOrders : myOrders;

  useEffect(() => {
    const id = setTimeout(() => setSelectedOrdersIds([]), 0);
    return () => clearTimeout(id);
  }, [activeTab]);

  return (
    <DeliveryCreateContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        selectedOrdersIds,
        setSelectedOrdersIds,
        formData,
        setFormData,
        activeTab,
        setActiveTab,
        currentOrders,
        ordersError: error,
        fullAddress,
        confirmedCorrect,
        setConfirmedCorrect,
        isOrdersLoading,
      }}
    >
      {children}
    </DeliveryCreateContext.Provider>
  );
};

// Хук для использования контекста
// eslint-disable-next-line react-refresh/only-export-components
export const useDeliveryCreate = () => {
  const ctx = useContext(DeliveryCreateContext);
  if (!ctx) {
    throw new Error("useDeliveryCreate must be used within Provider");
  }
  return ctx;
};

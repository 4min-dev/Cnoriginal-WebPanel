import DeliveryCreateChoice from "../deliveryCreate/DeliveryCreateChoice";
import DeliveryCreateForm from "../deliveryCreate/DeliveryCreateForm";
import DeliveryCreateFinal from "../deliveryCreate/DeliveryCreateFinal";

export const deliveryCreateSteps = [
  {
    id: 0,
    title: "Выбор отправлений",
    tooltip: "что-то написано",
    component: () => <DeliveryCreateChoice />,
    popupClass: "",
  },
  {
    id: 1,
    title: "Параметры доставки",
    tooltip: "что-то написано",
    component: () => <DeliveryCreateForm />,
    popupClass: "max-w-[550px]",
  },
  {
    id: 2,
    title: "Резюме",
    tooltip: "что-то написано",
    component: () => <DeliveryCreateFinal />,
    popupClass: "max-w-[680px]",
  },
];

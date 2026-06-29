import DeliveryCreateChoice from "../deliveryCreate/DeliveryCreateChoice";
import DeliveryCreateFinal from "../deliveryCreate/DeliveryCreateFinal";
import DeliveryCreateForm from "../deliveryCreate/DeliveryCreateForm";

const deliveryCreateSteps = [
  {
    id: 0,
    title: "Выбор отправлений",
    tooltip: "что-то написано",
    component: DeliveryCreateChoice,
  },
  {
    id: 1,
    title: "Параметры доставки",
    tooltip: "что-то написано",
    component: DeliveryCreateForm,
  },
  {
    id: 2,
    title: "Резюме",
    tooltip: "что-то написано",
    component: DeliveryCreateFinal,
  },
];

export default deliveryCreateSteps;

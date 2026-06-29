import type { DeliveryFormData } from "../../../context/DeliveryCreateContext";
import type { CreateDelivery } from "../../../types/Delivery";
import type { Order } from "../../../types/Order";

function createPostDataDelivery(
  data: DeliveryFormData,
  selectedOrdersIds: string[],
  allOrders: Order[],
): CreateDelivery {
  const [last_name = "-", first_name = "-", patronymic_name = "-"] = data.fio
    .trim()
    .split(" ");

  return {
    type: data.type,
    package: data.package,
    description: data.description,
    first_name,
    last_name,
    patronymic_name,
    phone_number: data.phone.replace(/[\s+-]/g, ""),
    full_address: `г. ${data.city}, ул. ${data.street}, д. ${data.house} ${data.flat ? "," + data.flat : ""}, ${data.postcode}`,
    declared_value: data.declared_value,
    lattice: data.lattice,
    orders_cn: allOrders.filter((order) =>
      selectedOrdersIds.includes(order.id),
    ),
  };
}

export default createPostDataDelivery;

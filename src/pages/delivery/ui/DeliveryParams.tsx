import TextField from "../../../ui/text/TextField";
import DefaultCard from "../../../ui/cards/DefaultCard";
import LHeading from "../../../ui/text/LHeading";
import { PACKAGE_VARIANTS } from "../../../types/Delivery";
import type React from "react";

type BaseDeliveryParams = {
  type?: string | null;
  delivery_company?: string | null;
  package?: string | null;
  lattice?: boolean;
  declared_value?: number | string | null;
};

type Props = {
  data: BaseDeliveryParams & Record<string, unknown>;
  children?: React.ReactNode;
};

const DeliveryParams: React.FC<Props> = ({ data, children }) => {
  return (
    <DefaultCard className="gap-6">
      <LHeading level={3}>Параметры доставки</LHeading>

      <TextField
        title="Способ доставки"
        value={data.type ? "Транспортная компания" : "По городу"}
      />

      {data.type && (
        <TextField
          title="ТК"
          value={data.type || data.delivery_company || "-"}
        />
      )}

      <TextField
        title="Упаковка"
        value={
          PACKAGE_VARIANTS.find((i) => i.key === data.package)?.value || "-"
        }
      />

      <TextField
        title="Обрешётка"
        value={data.lattice ? "Да" : "Нет"}
      />

      <TextField
        title="Объявленная ценность"
        value={
          data.declared_value
            ? `${Number(data.declared_value).toLocaleString()} ₽`
            : "-"
        }
      />

      {children}
    </DefaultCard>
  );
};

export default DeliveryParams;

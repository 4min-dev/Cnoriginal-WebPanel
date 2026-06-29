import EmptyBlock from "../../../ui/popup/EmptyBlock";

type Props = {
  title?: string;
  message?: string;
};

const EmptyDeliveries: React.FC<Props> = ({ title, message }) => (
  <EmptyBlock
    title={title ?? "Доставок нет"}
    message={message || "Здесь появятся ваши заказы на доставку"}
  ></EmptyBlock>
);

export default EmptyDeliveries;

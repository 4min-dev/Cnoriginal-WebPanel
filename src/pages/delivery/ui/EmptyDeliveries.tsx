import { Package } from "lucide-react";

const EmptyDeliveries: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
    <Package className="w-12 h-12 mb-4 text-gray-400" />
    <p className="text-lg font-medium">Доставок нет</p>
    <p className="text-sm text-gray-400 mt-1">
      Здесь появятся ваши заказы на доставку
    </p>
  </div>
);

export default EmptyDeliveries;

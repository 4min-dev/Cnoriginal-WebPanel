import { Package } from "lucide-react";

type Props = {
  title?: string;
  message?: string;
};

const EmptyBlock: React.FC<Props> = ({ title, message }) => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
    <Package className="w-12 h-12 mb-4 text-gray-400" />
    <p className="text-lg font-medium">{title}</p>
    <p className="text-sm text-gray-400 mt-1">{message}</p>
  </div>
);

export default EmptyBlock;

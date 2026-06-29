import React from "react";
import { X } from "lucide-react";

type PopupProps = {
  onClose: () => void;
  children?: React.ReactNode;
};

const Popup: React.FC<PopupProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 ">
      <div className="relative lg:w-[800px] w-full mx-[12px] lg:mx-0 bg-white rounded-[20px] md:rounded-2xl shadow-2xl h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <X
            size={20}
            color={"#B9B9B9"}
          />
        </button>
        <div className="p-1 h-full">{children}</div>
      </div>
    </div>
  );
};

export default Popup;

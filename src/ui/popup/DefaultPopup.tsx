import React, { forwardRef } from "react";
import { X } from "lucide-react";

type PopupProps = {
  onClose?: () => void;
  children?: React.ReactNode;
  classNameInner?: string;
};

// Используем forwardRef для доступа к внутреннему контейнеру
const DefaultPopup = forwardRef<HTMLDivElement, PopupProps>(
  ({ onClose, children, classNameInner }, ref) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div
          ref={ref}
          className={`flex p-4 relative lg:w-[800px] w-full mx-[12px] lg:mx-0 bg-white rounded-[20px] md:rounded-2xl min-h-[80vh]  overflow-y-auto ${classNameInner}`}
        >
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X
                size={20}
                color="#B9B9B9"
              />
            </button>
          )}
          <div className="p-1 flex-1">{children}</div>
        </div>
      </div>
    );
  },
);

export default DefaultPopup;

import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

type SideDrawerProps = {
  isOpen: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
};

const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  children,
  onClose,
}) => {
  const [isRender, setIsRender] = useState(false);
  const [isShow, setIsShow] = useState(false);

  /*
  isRender - переменная, которая определяет, рендрентся ли компонент
  isShow - переменная, которая определяет, видна ли боковушка 

  чтобы все было плавно, деаем так 

  isOpen = true -> isRender = true -> 100мс чтобы дальше отработал transition -> isShow = true

  isOpen = false -> isShow = false -> 100мс чтобы за них отработал обратный transition -> isRender = false
  
  */

  useEffect(() => {
    if (isOpen === true) {
      setTimeout(() => {
        setIsRender(true);
      }, 1);
      setTimeout(() => {
        setIsShow(true);
      }, 100);
    } else {
      setTimeout(() => {
        setIsShow(false);
      }, 1);
      setTimeout(() => {
        setIsRender(false);
      }, 100);
    }
  }, [isOpen]);

  if (!isRender) return null;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed top-0 left-0 w-full h-full bg-black z-49 transition-opacity duration-300 ${
          isShow ? "opacity-30" : "opacity-0"
        }`}
      ></div>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 lg:w-[683px] sm:w-[600px] w-full  h-full bg-white z-49 transform transition-transform duration-300 overflow-y-auto ${
          isShow ? "translate-x-0" : "translate-x-full"
        }`}
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
        {children}
      </div>
    </>
  );
};

export default SideDrawer;

import type React from "react";

import DefaultPopup from "./DefaultPopup";
import LHeading from "../text/LHeading";
import DefaultBtn from "../DefaultBtn";

type PopupProps = {
  status: "error" | "success";
  title?: string | React.ReactNode;
  text?: string;
  btnText?: string;
  setShowPopup: (show: boolean) => void;
};

const StatusPopup: React.FC<PopupProps> = ({
  status,
  title,
  text,
  setShowPopup,
  btnText,
}) => {
  return (
    <DefaultPopup
      classNameInner="max-w-[480px] min-h-[357px]! flex flex-col items-center justify-center"
      onClose={() => setShowPopup(false)}
    >
      <div className="flex flex-col items-center justify-center text-center px-[26px]">
        <div className="mb-5">
          {status === "error" ? (
            <img
              className="sm:w-[110px] w-[124px]"
              src="images/warnTriangle.svg"
              alt="status error"
            />
          ) : (
            <img
              className="sm:w-[110px] w-[124px]"
              src="images/status-success.svg"
              alt="status success"
            />
          )}
        </div>
        <LHeading
          level={1}
          className="mb-2"
        >
          {title}
        </LHeading>
        <p className="text-[#B9B9B9] text-[14px] sm:text-[16px] mb-6 font-light">
          {text}
        </p>

        <DefaultBtn
          className=""
          onClick={() => setShowPopup(false)}
        >
          {btnText ? btnText : "Хорошо"}
        </DefaultBtn>
      </div>
    </DefaultPopup>
  );
};

export default StatusPopup;

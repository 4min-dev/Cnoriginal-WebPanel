import type { ReactNode } from "react";
import { defaultInputStyles } from "../inputs/LabelInput";

type TextFieldProps = {
  title: string;
  value?: string | number;
  children?: ReactNode;
  variant?: "text" | "input";
  className?: string;
};

const TextField: React.FC<TextFieldProps> = ({
  title,
  value,
  children,
  variant = "text",
  className = ''
}) => {
  const renderContent = () => {
    if (children) return children;

    if (variant === "input") {
      return (
        <p className={defaultInputStyles + "h-[44px] px-[12px] " + (className || "")}>
          {value}
        </p>
      );
    }

    return <div className="text-[#333333] text-[16px]">{value}</div>;
  };

  return (
    <div>
      <div className="text-[#B9B9B9] text-[14px] mb-1">{title}</div>
      {renderContent()}
    </div>
  );
};

export default TextField;

import React, { type InputHTMLAttributes, type ReactNode } from "react";

import TelInput from "./TelInput";
import PriceInput from "./PriceInput";

interface BaseProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label?: string;
  id?: string;
  className?: string;
  required?: boolean;
  hint?: ReactNode;
  value?: any;
  lastSymbol?: string;
}

interface PriceInputProps extends BaseProps {
  type: "price";
  onChange?: (value: number) => void;
}

interface DefaultInputProps extends BaseProps {
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

type InputFieldProps = PriceInputProps | DefaultInputProps;

export const defaultInputStyles = `ueser-invalid flex items-center
  border border-[#B9B9B966] rounded-[10px] font-medium text-[#333333]
  h-[44px] px-[12px] w-full`;

const InputComponents: Record<string, any> = {
  tel: TelInput,
  price: PriceInput,
  text: "input",
};

const LabelInput: React.FC<InputFieldProps> = ({
  label,
  id,
  className = "",
  required = false,
  hint,
  type = "text",
  value,
  onChange,
  lastSymbol,
  ...props
}) => {
  const Component = InputComponents[type] || "input";

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={
            "mb-1 text-[14px]" + (required ? " text-[#000]" : " text-[#B9B9B9]")
          }
        >
          {label} {required && <span className="text-[#ED0028]">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <Component
          id={id}
          className={defaultInputStyles}
          required={required}
          value={value}
          onChange={onChange}
          {...props}
          style={{ paddingRight: lastSymbol ? "2em" : undefined }}
        />

        {lastSymbol && (
          <span
            style={{
              position: "absolute",
              right: "0.5em",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#555",
            }}
          >
            {lastSymbol}
          </span>
        )}
      </div>

      {hint && <span className="mt-1 text-[14px] text-[#B9B9B9]">{hint}</span>}
    </div>
  );
};

export default LabelInput;

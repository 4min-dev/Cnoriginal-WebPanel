import React, { type InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
  className?: string;
  required?: boolean;
}

const LabelInput: React.FC<InputFieldProps> = ({
  label,
  id,
  className = "",
  required = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <label
        htmlFor={id}
        className={
          "mb-1 text-[14px] text-[#B9B9B9]" +
          `${required ? "text-[#000]" : "text-[#B9B9B9]"}`
        }
      >
        {label} {required && <span className="text-[#ED0028]">*</span>}
      </label>
      <input
        id={id}
        className="w-full h-[44px] flex items-center px-[12px] border border-[#B9B9B966] rounded-[10px] font-medium text-[#333333] text-[15px] lg:text-[16px] outline-none"
        {...props}
      />
    </div>
  );
};

export default LabelInput;

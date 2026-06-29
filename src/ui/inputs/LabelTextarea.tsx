import React, { type InputHTMLAttributes, type ReactNode } from "react";

interface TextareaFieldProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id?: string;
  className?: string;
  required?: boolean;
  hint?: ReactNode;
}

const LabelTextarea: React.FC<TextareaFieldProps> = ({
  label,
  id,
  className = "",
  required = false,
  hint,
  ...props
}) => {
  return (
    <div className={`flex flex-col mb-4 w-full ${className}`}>
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
      <textarea
        required
        id={id}
        className="ueser-invalid py-3 px-5 w-full min-h-[120px] flex items-center px-[12px] border border-[#B9B9B966] rounded-[10px] font-medium text-[#333333] text-[15px] lg:text-[16px] "
        {...props}
      />
      {hint && <span className="mt-1 text-[14px] text-[#B9B9B9]">{hint}</span>}
    </div>
  );
};

export default LabelTextarea;

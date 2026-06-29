import React, { type ChangeEvent, type ReactNode } from "react";

export interface DefaultSelectOption {
  value: string;
  key: string;
}

interface SelectProps {
  options?: DefaultSelectOption[];
  value?: string;
  onChange?: (option: DefaultSelectOption | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  hint?: ReactNode;
}

const DefaultSelect: React.FC<SelectProps> = ({
  options,
  value = "",
  onChange,
  placeholder = "Выберите...",
  className = "",
  disabled = false,
  label,
  required = false,
  hint,
}) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = options?.find((opt) => opt.key === e.target.value);
    onChange?.(selected);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          className={
            "mb-1 text-[14px]" + (required ? " text-[#000]" : " text-[#B9B9B9]")
          }
        >
          {label} {required && <span className="text-[#ED0028]">*</span>}
        </label>
      )}

      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full h-[44px] px-[12px] border border-[#B9B9B966] rounded-[10px] bg-white text-[#333333] text-[15px] lg:text-[16px] cursor-pointer disabled:cursor-not-allowed disabled:bg-[#F3F3F3] disabled:opacity-50"
      >
        <option
          value=""
          disabled
        >
          {placeholder}
        </option>

        {options?.map((opt) => (
          <option
            key={opt.key}
            value={opt.key}
          >
            {opt.value}
          </option>
        ))}
      </select>

      {hint && <span className="mt-1 text-[12px] text-[#7A7A7A]">{hint}</span>}
    </div>
  );
};

export default DefaultSelect;

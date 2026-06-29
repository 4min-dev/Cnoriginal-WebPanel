import React from "react";

type InputRadioProps = {
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  children?: React.ReactNode;
};

const InputRadio: React.FC<InputRadioProps> = ({
  className = "",
  checked,
  defaultChecked,
  onChange = () => {},
  name,
  value,
  id,
  disabled = false,
  required = false,
  children,
}) => {
  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <input
        type="radio"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        name={name}
        value={value}
        id={id}
        disabled={disabled}
        required={required}
        className={`
          relative
          min-w-[24px] min-h-[24px]
          appearance-none
          rounded-full
          text-[16px]
          cursor-pointer
          disabled:cursor-default
          border-1 border-[#B9B9B966]
          bg-transparent
          transition-all duration-200
          checked:border-[1px]
          checked:border-[#ED0028]
          checked:bg-[#ED0028]
          checked:after:content-['']
          checked:after:absolute
          checked:after:inset-0
          checked:after:m-auto
          checked:after:w-[21px] 
          checked:after:h-[21px]
          checked:after:border-[3.5px]
          checked:after:border-[#FFF]
          checked:after:rounded-full
        `}
      />
      {children && (
        <span className="ml-3 color-[#333333] text-[16px]">{children}</span>
      )}
    </label>
  );
};

export default InputRadio;

import React, { useId } from "react";

type InputSwitchProps = {
  className?: string;
  checked?: boolean;
  onChange?: () => void;
  name?: string;
  children?: React.ReactNode;
};

const InputSwitch: React.FC<InputSwitchProps> = ({
  className = "",
  checked = false,
  onChange = () => {},
  name,
  children,
}) => {
  const id = useId();

  return (
    <div className={`flex items-center ${className}`}>
      <label
        htmlFor={id}
        className="relative cursor-pointer"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          name={name}
          className="sr-only peer"
        />

        <div
          className="
            w-[45px] h-[25px]
            bg-[#B9B9B933]
            rounded-full
            transition-colors duration-200

            peer-checked:bg-[#ED0028]

            peer-focus:outline-none
            peer-focus-visible:ring-2
            peer-focus-visible:ring-[#000]
          "
        />

        <div
          className="
            absolute top-[3px] left-[3px]
            w-[19px] h-[19px]
            bg-[#B9B9B9]
            rounded-full
            transition-all duration-200

            peer-checked:translate-x-[20px]
            peer-checked:bg-[#FFFFFF]

          "
        />
      </label>

      {children && (
        <label
          htmlFor={id}
          className="
            ml-3 cursor-pointer text-[16px] text-[#333333]
          "
        >
          {children}
        </label>
      )}
    </div>
  );
};

export default InputSwitch;

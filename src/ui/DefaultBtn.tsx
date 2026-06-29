import React, { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  adaptive?: boolean;
  className?: string;
  isLoading?: boolean;
};

const DefaultBtn: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  disabled,
  isLoading = false,
  adaptive = false,
  type = "button",
  ...props
}) => {
  let baseClasses =
    "relative flex items-center justify-center font-medium rounded-[10px] cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-default  ";

  if (adaptive) {
    baseClasses +=
      "h-[36px] px-2 text-[14px]  sm:text-[16px] sm:h-[44px] sm:px-4";
  } else {
    baseClasses += " h-[44px] px-4 text-[16px]";
  }

  if (variant === "primary") {
    baseClasses += " bg-[#ED0028] text-[#FCFDFF] border-none";
  } else if (variant === "secondary") {
    baseClasses += " bg-[#F6F6F6] text-[#333333] border-none";
  } else if (variant === "outline") {
    baseClasses += " bg-white text-[#333333] border border-[#F1F1F1]";
  }

  const combinedClassName = `${baseClasses} ${className}`.trim();

  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}

      {isLoading && (
        <span className="absolute right-3 w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
    </button>
  );
};

export default DefaultBtn;

import React, { type ReactNode } from "react";

interface LHeadingProps {
  level?: 1 | 2 | 3;
  children?: ReactNode;
  className?: string;
}

const LHeading: React.FC<LHeadingProps> = ({
  level = 1,
  children,
  className = "",
}) => {
  switch (level) {
    case 1:
      return (
        <h1
          className={` font-semibold text-[24px] line-clamp-2 text-[#33331F] leading-8 ${className}`}
        >
          {children}
        </h1>
      );
    case 2:
      return (
        <h2
          className={`lg:text-[28px] text-[24px] font-semibold text-[#33331F] ${className}`}
        >
          {children}
        </h2>
      );
    case 3:
      return (
        <h3
          className={`font-semibold text-[20px] lg:text-[22px] text-[#33331F] ${className}`}
        >
          {children}
        </h3>
      );
    default:
      return <>{children}</>;
  }
};

export default LHeading;

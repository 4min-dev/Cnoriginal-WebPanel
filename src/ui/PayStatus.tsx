// components/StatusIcon.tsx
import React from "react";
import WaitStatus from "./icons/WaitStatus";
import SuccessStatus from "./icons/SuccessStatus";
import WarnStatus from "./icons/WarnStatus";
import ErrorStatus from "./icons/RedStatus";

type IconColor = "red" | "green" | "orange" | "gray";

export type PayStatusPropsType = {
  color: IconColor;
  text: string;
};

const icons: Record<IconColor, { color: string; icon: () => React.ReactNode }> =
  {
    red: {
      icon: () => <ErrorStatus />,
      color: "#ED0028",
    },
    green: {
      icon: () => <SuccessStatus />,
      color: "#47D40A",
    },
    orange: {
      icon: () => <WarnStatus />,
      color: "#FFC31D",
    },
    gray: {
      icon: () => <WaitStatus />,
      color: "#B9B9B9",
    },
  };

type StatusKey = string;

type StatusConfig<T extends StatusKey> = Record<T, PayStatusPropsType>;

type StatusIconProps<T extends StatusKey = StatusKey> = {
  statusesSettings: StatusConfig<T>;
  status: T;
  variant: "short" | "full";
  className?: string;
};

const PayStatus = <T extends StatusKey>({
  status,
  variant,
  statusesSettings,
  className,
}: StatusIconProps<T>) => {
  const statusConfig = statusesSettings[status];

  const bgColor = icons[statusConfig.color]?.color;

  return (
    <div className={className}>
      {variant === "full" ? (
        <p
          className={`bg-[${bgColor}] py-[3px] px-[10px] rounded-3xl text-white text-[14px] `}
        >
          {statusConfig.text}
        </p>
      ) : (
        <span>{icons[statusConfig.color]?.icon()}</span>
      )}
    </div>
  );
};

export default PayStatus;

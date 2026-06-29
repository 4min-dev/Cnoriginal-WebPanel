import React, {
  type ChangeEvent,
  type InputHTMLAttributes,
  useState,
} from "react";
import { defaultInputStyles } from "./LabelInput";

interface PriceInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: string | number;
  onChange?: (value: string) => void;
}

const formatPrice = (value: string | number) => {
  if (!value && value !== 0) return "";
  const number =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/\s/g, ""));
  if (isNaN(number)) return "";
  return number.toLocaleString("ru-RU").replace(/\u00A0/g, " ");
};

const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    formatPrice(value),
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setInternalValue(formatPrice(rawValue));
    if (onChange) onChange(rawValue);
  };

  return (
    <input
      className={defaultInputStyles}
      value={internalValue}
      onChange={handleChange}
      {...props}
    />
  );
};

export default PriceInput;

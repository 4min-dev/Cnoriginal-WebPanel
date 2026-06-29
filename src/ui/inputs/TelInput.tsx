import React from "react"
import { useInternationalPhoneInput } from "use-phone-input"
import phoneNumberUtils from "use-phone-input/phoneNumberUtils"
import { defaultInputStyles } from "./LabelInput"

interface TelInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TelInput: React.FC<TelInputProps> = ({ value = "", onChange, ...props }) => {
  const phone = phoneNumberUtils.toPhoneNumber(value)

  const { inputProps } = useInternationalPhoneInput(
    phoneNumberUtils,
    phone,
    (newPhone) => {
      const event = {
        target: { value: newPhone.formattedValue || "" },
        currentTarget: { value: newPhone.formattedValue || "" }
      } as React.ChangeEvent<HTMLInputElement>

      onChange?.(event)
    }
  )

  return (
    <input
      {...inputProps}
      {...props}
      className={`${props.className || ""} ${defaultInputStyles}`}
    />
  )
}

export default TelInput
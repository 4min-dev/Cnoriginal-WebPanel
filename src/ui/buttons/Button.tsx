import React from 'react'

type ButtonProps = {
    disabled?: boolean,
    buttonText: string,
    clickHandler: (args?: any) => void,
    className?: string,
    icon?: React.ReactNode,
    isReversed?: boolean
}

const Button: React.FC<ButtonProps> = ({ disabled = false, buttonText, clickHandler, className, icon, isReversed = false }) => {
    return (
        <button
            type='button'
            disabled={disabled}
            className={`bg-[#ED0028] font-medium text-[#FCFDFF] cursor-pointer flex items-center justify-center 
                                   transition-all duration-200 ease-in-out
                                   hover:bg-[#ED0028CC] hover:shadow-[0px_0px_22.4px_0px_#ED002880] border border-[transparent]
                                   active:bg-white active:opacity-50 active:border active:border-[#ED0028] active:text-[#ED0028]
                                   disabled:opacity-50 disabled:bg-white disabled:border disabled:border-[#B9B9B9] disabled:text-[#B9B9B9] disabled:hover:shadow-none ${className || ''}`}
            onClick={clickHandler}>
            {(icon && !isReversed) && icon}
            {buttonText}
            {(icon && isReversed) && icon}
        </button>
    )
}

export default Button

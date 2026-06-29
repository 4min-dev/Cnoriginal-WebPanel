import React from 'react'

type DateInputProps = {
    readOnly?: boolean,
    value: string,
    onChange: (value: string) => void,
    className?: string
}

const DateInput: React.FC<DateInputProps> = ({ readOnly = false, value, onChange, className }) => {

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let value = e.target.value.replace(/\D/g, '')

        if (value.length > 8) value = value.slice(0, 8)

        let day = value.slice(0, 2)
        let month = value.slice(2, 4)
        let year = value.slice(4, 8)

        if (day.length === 2) {
            const dayNum = parseInt(day, 10)
            if (dayNum > 31) day = '31'
            if (dayNum === 0) day = '01'
        }

        if (month.length === 2) {
            const monthNum = parseInt(month, 10)
            if (monthNum > 12) month = '12'
            if (monthNum === 0) month = '01'
        }

        if (year.length === 4) {
            const yearNum = parseInt(year, 10)
            const currentYear = new Date().getFullYear()

            if (yearNum < 1925) year = '1925'
            if (yearNum > currentYear) year = currentYear.toString()
        }

        let formatted = ''
        if (day) formatted += day
        if (month) formatted += '.' + month
        if (year) formatted += '.' + year

        onChange(formatted)
    }

    return (
        <input
            readOnly={readOnly}
            type='text'
            value={value}
            onChange={handleChange}
            className={`outline-none border border-[#B9B9B966] bg-none text-[#333333] ${className ? className : ''}`}
            placeholder='10.02.2000'
            maxLength={10}
        />
    )
}

export default DateInput

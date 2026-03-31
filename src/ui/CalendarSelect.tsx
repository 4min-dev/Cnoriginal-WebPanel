import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    isWithinInterval,
    isAfter,
} from 'date-fns'

interface PeriodData {
    start: Date | null,
    end: Date | null
}

interface CalendarSelectProps {
    title: string,
    onPeriodChange?: (period: PeriodData) => void,
    initialPeriod?: PeriodData
}

const CalendarSelect: React.FC<CalendarSelectProps> = ({
    title,
    onPeriodChange,
    initialPeriod,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodData>(
        initialPeriod || { start: null, end: null }
    )
    const [hoverDate, setHoverDate] = useState<Date | null>(null)

    const calendarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    useEffect(() => {
        onPeriodChange?.(selectedPeriod)
    }, [selectedPeriod, onPeriodChange])

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

    const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

    const handleDateClick = (date: Date) => {
        if (!selectedPeriod.start || (selectedPeriod.start && selectedPeriod.end)) {
            setSelectedPeriod({ start: date, end: null })
        } else {
            if (isAfter(date, selectedPeriod.start)) {
                setSelectedPeriod(prev => ({ ...prev, end: date }))
                setIsOpen(false)
            } else {
                setSelectedPeriod({ start: date, end: selectedPeriod.start })
            }
        }
    }

    const resetPeriod = () => {
        setSelectedPeriod({ start: null, end: null })
        setIsOpen(false)
    }

    const isInRange = (date: Date) => {
        if (!selectedPeriod.start) return false
        if (!selectedPeriod.end && hoverDate) {
            return isWithinInterval(date, { start: selectedPeriod.start, end: hoverDate })
        }
        if (selectedPeriod.end) {
            return isWithinInterval(date, { start: selectedPeriod.start, end: selectedPeriod.end })
        }
        return isSameDay(date, selectedPeriod.start)
    }

    const displayText = selectedPeriod.start
        ? selectedPeriod.end
            ? `${format(selectedPeriod.start, 'dd.MM.yyyy')} — ${format(selectedPeriod.end, 'dd.MM.yyyy')}`
            : format(selectedPeriod.start, 'dd.MM.yyyy')
        : title

    return (
        <div className="relative" ref={calendarRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-[4px] px-[8px] h-[32px] max-w-[260px] 
                           rounded-[10px] bg-[#F6F6F6] hover:bg-[#EDEDED] transition-colors
                           font-medium text-[13px] text-[#333333] border border-transparent hover:border-gray-200 cursor-pointer"
            >
                <span className="truncate">{displayText}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0)">
                        <path d="M5.83337 8.33333L10 12.5" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 12.5L14.1667 8.33333" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <defs>
                        <clipPath id="clip0">
                            <rect width="20" height="20" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 z-50 bg-white rounded-3xl p-6 shadow-xl border border-gray-100 w-[320px]">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="font-semibold text-lg text-gray-800">
                            {format(currentMonth, 'MMMM yyyy')}
                        </div>

                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-3">
                        {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map(day => (
                            <div key={day} className="text-center text-xs text-gray-500 font-medium">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, index) => {
                            const isCurrentMonthDay = isSameMonth(day, currentMonth)
                            const inRange = isInRange(day)
                            const isStart = selectedPeriod.start && isSameDay(day, selectedPeriod.start)
                            const isEnd = selectedPeriod.end && isSameDay(day, selectedPeriod.end)

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleDateClick(day)}
                                    onMouseEnter={() => setHoverDate(day)}
                                    onMouseLeave={() => setHoverDate(null)}
                                    className={`
                                        aspect-square cursor-pointer flex items-center justify-center rounded-xl text-sm font-medium transition-all
                                        ${!isCurrentMonthDay ? 'text-gray-300' : 'text-gray-900'}
                                        ${isStart || isEnd ? 'ring-2 ring-pink-400' : ''}
                                        ${inRange && !isStart && !isEnd ? 'bg-pink-100' : ''}
                                        ${!inRange && isCurrentMonthDay ? 'hover:bg-gray-100' : ''}
                                    `}
                                >
                                    {format(day, 'd')}
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        {selectedPeriod.start && (
                            <button
                                onClick={resetPeriod}
                                className="text-pink-600 hover:text-pink-700 text-sm font-medium transition-colors"
                            >
                                Сбросить
                            </button>
                        )}
                        <div className="text-center text-xs text-gray-500">
                            Выберите начало и конец периода
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CalendarSelect
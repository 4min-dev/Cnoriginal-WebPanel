import React from 'react'
import { CalendarDays, Clock3, Warehouse } from 'lucide-react'

type ScheduleItem = {
    label: string
    days: number[]
    time?: string
    startMinutes?: number
    endMinutes?: number
}

const WAREHOUSE_TIME_ZONE = 'Asia/Vladivostok'

const schedule: ScheduleItem[] = [
    { label: 'Понедельник', days: [1] },
    {
        label: 'Вторник',
        days: [2],
        time: '15:00–19:00',
        startMinutes: 15 * 60,
        endMinutes: 19 * 60,
    },
    { label: 'Среда, четверг', days: [3, 4] },
    {
        label: 'Пятница',
        days: [5],
        time: '15:00–19:00',
        startMinutes: 15 * 60,
        endMinutes: 19 * 60,
    },
    { label: 'Суббота', days: [6] },
    {
        label: 'Воскресенье',
        days: [0],
        time: '15:00–17:00',
        startMinutes: 15 * 60,
        endMinutes: 17 * 60,
    },
]

const weekdayIndexes: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
}

const getWarehouseTime = () => {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: WAREHOUSE_TIME_ZONE,
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(new Date())

    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))

    return {
        day: weekdayIndexes[values.weekday],
        minutes: Number(values.hour) * 60 + Number(values.minute),
        time: `${values.hour}:${values.minute}`,
    }
}

const WarehouseScheduleCard: React.FC = () => {
    const [warehouseTime, setWarehouseTime] = React.useState(getWarehouseTime)

    React.useEffect(() => {
        const timer = window.setInterval(() => {
            setWarehouseTime(getWarehouseTime())
        }, 60_000)

        return () => window.clearInterval(timer)
    }, [])

    const todaySchedule = schedule.find(item => item.days.includes(warehouseTime.day))
    const isOpen = Boolean(
        todaySchedule?.time
        && todaySchedule.startMinutes !== undefined
        && todaySchedule.endMinutes !== undefined
        && warehouseTime.minutes >= todaySchedule.startMinutes
        && warehouseTime.minutes < todaySchedule.endMinutes
    )

    const todayStatus = isOpen
        ? 'Склад открыт'
        : todaySchedule?.time
            ? `Сегодня ${todaySchedule.time}`
            : 'Сегодня выходной'

    return (
        <section className="flex flex-col bg-white border border-[#F3F3F3] rounded-[20px] p-[20px] shadow-[0_0_26px_0_rgba(15,15,43,0.05)]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-[12px]">
                <div className="flex items-center gap-[10px] min-w-0">
                    <div className="flex items-center justify-center shrink-0 w-[40px] h-[40px] rounded-[12px] bg-[#FFF0F2] text-[#ED0028]">
                        <Warehouse size={21} strokeWidth={1.8} aria-hidden="true" />
                    </div>

                    <div className="flex flex-col min-w-0">
                        <h2 className="font-semibold text-[18px] text-[#333333] leading-[22px]">
                            График работы склада
                        </h2>
                        <span className="text-[13px] text-[#B9B9B9] mt-[3px]">
                            Время Владивостока
                        </span>
                    </div>
                </div>

                <div
                    className={`shrink-0 flex items-center gap-[6px] w-fit min-h-[28px] px-[9px] rounded-[9px] text-[12px] font-medium ${
                        isOpen
                            ? 'bg-[#EAF9EA] text-[#20B820]'
                            : 'bg-[#F6F6F6] text-[#777777]'
                    }`}
                >
                    <Clock3 size={14} strokeWidth={1.8} aria-hidden="true" />
                    <span>{todayStatus}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-[8px] mt-[18px]">
                {schedule.map(item => {
                    const isToday = item.days.includes(warehouseTime.day)

                    return (
                        <div
                            key={item.label}
                            className={`flex flex-col justify-between min-h-[70px] p-[12px] rounded-[12px] border ${
                                isToday
                                    ? 'border-[#ED002833] bg-[#FFF7F8]'
                                    : 'border-[#F3F3F3] bg-[#FCFCFC]'
                            }`}
                        >
                            <div className="flex items-center gap-[6px] min-w-0">
                                <CalendarDays
                                    size={15}
                                    strokeWidth={1.7}
                                    className={isToday ? 'text-[#ED0028]' : 'text-[#B9B9B9]'}
                                    aria-hidden="true"
                                />
                                <span className="text-[13px] text-[#777777] leading-[16px] truncate">
                                    {item.label}
                                </span>
                            </div>

                            <span
                                className={`font-semibold text-[15px] leading-[18px] mt-[8px] ${
                                    item.time ? 'text-[#333333]' : 'text-[#B9B9B9]'
                                }`}
                            >
                                {item.time ?? 'Выходной'}
                            </span>
                        </div>
                    )
                })}
            </div>

            <div className="flex items-center justify-between gap-[12px] mt-[14px] pt-[12px] border-t border-dashed border-[#E7E7E7]">
                <span className="text-[13px] text-[#B9B9B9]">
                    Текущее время на складе
                </span>
                <span className="font-medium text-[14px] text-[#333333]">
                    {warehouseTime.time}
                </span>
            </div>
        </section>
    )
}

export default WarehouseScheduleCard

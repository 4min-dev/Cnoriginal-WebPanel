import React from 'react'
import isMobileDevice from '../../../assets/isMobileDevice'
import type { User } from '../../../types/User'

type SubscriptionCardProps = {
    profile?: User,
    subscriptionActive: boolean,
    payHandler: () => void
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ profile, subscriptionActive, payHandler }) => {
    const isMobile = isMobileDevice()

    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}.${month}.${year}`
    }

    const getDaysLeft = (isoDate: string): number => {
        const endDate = new Date(isoDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const timeDiff = endDate.getTime() - today.getTime()
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24))

        return Math.max(0, daysLeft)
    }

    const subEndDate = profile?.sub_end
    const daysLeft = subEndDate ? getDaysLeft(subEndDate) : 12
    const formattedEndDate = subEndDate ? formatDate(subEndDate) : '14.12.2025'

    const isSubscriptionEndingToday = daysLeft === 0

    const MAX_DAYS = 30
    const progress = Math.max(0, Math.min(100, ((MAX_DAYS - daysLeft) / MAX_DAYS) * 100))

    const imageWidthPercent = 15 + (progress * 0.85)

    return (
        <div>
            <div className='flex flex-col p-[20px] bg-white border border-[#F3F3F3] rounded-[20px]'>
                <div className='flex grow items-center justify-between'>
                    <div className='flex items-center lg:gap-[8px] gap-[6px]'>
                        <span className='font-medium text-[16px] text-[#333333] h-[19px] mb-[5px]'>
                            Подписка
                        </span>

                        <span
                            className={`lg:h-[20px] h-[18px] w-fit lg:py-[3.5px] lg:px-[6px] rounded-[12px] lg:min-w-[63px] py-[3px] px-[4px] min-w-[55px] flex items-center justify-center bg-[${subscriptionActive ? '#1D7BFF' : '#ED0028'
                                }] text-[13px] text-white`}
                        >
                            {subscriptionActive ? 'Активна' : 'Закончилась'}
                        </span>
                    </div>

                    <button type='button' className='bg-none outline-none border-none cursor-pointer'>
                        <svg
                            className='w-[28px] h-[28px] lg:w-[24px] lg:h-[24px]'
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M6.75 12C6.75 12.1989 6.67098 12.3897 6.53033 12.5303C6.38968 12.671 6.19891 12.75 6 12.75C5.80109 12.75 5.61032 12.671 5.46967 12.5303C5.32902 12.3897 5.25 12.1989 5.25 12C5.25 11.8011 5.32902 11.6103 5.46967 11.4697C5.61032 11.329 5.80109 11.25 6 11.25C6.19891 11.25 6.38968 11.329 6.53033 11.4697C6.67098 11.6103 6.75 11.8011 6.75 12ZM12.75 12C12.75 12.1989 12.671 12.3897 12.5303 12.5303C12.3897 12.671 12.1989 12.75 12 12.75C11.8011 12.75 11.6103 12.671 11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12C11.25 11.8011 11.329 11.6103 11.4697 11.4697C11.6103 11.329 11.8011 11.25 12 11.25C12.1989 11.25 12.3897 11.329 12.5303 11.4697C12.671 11.6103 12.75 11.8011 12.75 12ZM18.75 12C18.75 12.1989 18.671 12.3897 18.5303 12.5303C18.3897 12.671 18.1989 12.75 18 12.75C17.8011 12.75 17.6103 12.671 17.4697 12.5303C17.329 12.3897 17.25 12.1989 17.25 12C17.25 11.8011 17.329 11.6103 17.4697 11.4697C17.6103 11.329 17.8011 11.25 18 11.25C18.1989 11.25 18.3897 11.329 18.5303 11.4697C18.671 11.6103 18.75 11.8011 18.75 12Z"
                                stroke="#B9B9B9"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {subscriptionActive && (
                    <div className='flex items-center justify-between grow mt-[20px] h-[16px]'>
                        <span className='text-[13px] text-[#B9B9B9]'>
                            {isSubscriptionEndingToday
                                ? 'Сегодня заканчивается'
                                : `Осталось ${daysLeft} ${daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}`}
                        </span>

                        <div className='flex'>
                            <span className='text-[13px] text-[#B9B9B9]'>До &nbsp;</span>
                            <span className='font-medium text-[13px] text-[#333333]'>
                                {formattedEndDate}
                            </span>
                        </div>
                    </div>
                )}

                {subscriptionActive && (
                    <div className='flex grow lg:h-[95px] h-[80px] rounded-[16px] bg-[#F5F5F5] mt-[12px] relative overflow-hidden'>
                        <img
                            src='images/colorTriangle.png'
                            className='h-full absolute left-0 top-0 bottom-0 rounded-[16px] transition-all duration-500 ease-out'
                            style={{
                                width: `${imageWidthPercent}%`,
                            }}
                            alt='fill value'
                        />
                    </div>
                )}

                <div className='flex h-[44px] justify-between mt-[16px]'>
                    <div className='flex flex-col lg:gap-[6px] gap-[8px]'>
                        <span className='text-[13px] text-[#B9B9B9] h-[16px]'>
                            {isMobile ? 'Стоимость' : ' Стоимость подписки'}
                        </span>

                        <div className='flex lg:h-[20px] h-[18px]'>
                            <span className='font-semibold lg:text-[20px] text-[18px] text-[#33331F]'>
                                {profile?.subscribe_price ? `${profile.subscribe_price} ₽` : '490 ₽'}&nbsp;
                            </span>
                            <span className='font-medium lg:text-[20px] text-[18px] text-[#B9B9B9]'>
                                / мес
                            </span>
                        </div>
                    </div>

                    <button
                        type='button'
                        className='h-full lg:w-[187px] w-[177px] flex items-center justify-center rounded-[10px] bg-[#ED0028] font-medium lg:text-[16px] text-[15px] text-[#FCFDFF] px-[16px] bg-none outline-none border-none cursor-pointer'
                        onClick={payHandler}
                    >
                        {subscriptionActive ? 'Продлить подписку' : 'Оформить подписку'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionCard
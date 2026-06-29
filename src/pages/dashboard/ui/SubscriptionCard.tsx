import React from 'react'
import isMobileDevice from '../../../assets/isMobileDevice'
import type { User } from '../../../types/User'
import Button from '../../../ui/buttons/Button'

type SubscriptionCardProps = {
    profile?: User,
    subscriptionActive: boolean,
    payHandler: () => void
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ profile, subscriptionActive, payHandler }) => {
    const isMobile = isMobileDevice()

    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate)
        const day = String(date.getUTCDate()).padStart(2, '0')
        const month = String(date.getUTCMonth() + 1).padStart(2, '0')
        const year = date.getUTCFullYear()
        return `${day}.${month}.${year}`
    }

    const getDaysLeft = (isoDate: string): number => {
        if (!isoDate) return 0

        const endDate = new Date(isoDate)
        const now = new Date()

        const endDay = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate())
        const todayDay = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())

        const timeDiff = endDay.getTime() - todayDay.getTime()
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24))

        return Math.max(0, daysLeft)
    }

    const subEndDate = profile?.sub_end
    const daysLeft = subEndDate ? getDaysLeft(subEndDate) : 12
    const formattedEndDate = subEndDate ? formatDate(subEndDate) : '14.12.2025'

    const isSubscriptionEndingToday = daysLeft === 0

    const MAX_DAYS = 31

    const daysLeftNormalized = subscriptionActive ? Math.max(0, daysLeft) : 0

    const progress = Math.min(100, Math.max(0, (daysLeftNormalized / MAX_DAYS) * 100))

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
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-0 top-0 h-full bottom-0"
                            style={{ width: `${imageWidthPercent}%` }}
                            viewBox="0 0 284 95"
                            preserveAspectRatio="none" fill="none">
                            <g clip-path="url(#clip0_1675_2270)">
                                <path d="M268.581 60.8334L227.524 67.3357L281.214 102.475L268.581 60.8334Z" fill="#709AEC" stroke="#709AEC" stroke-linejoin="round" />
                                <path d="M227.524 67.3357L226.8 117.45L281.214 102.475L227.524 67.3357Z" fill="#6E98EC" stroke="#6E98EC" stroke-linejoin="round" />
                                <path d="M323.06 52.4263L274.766 18.6009L268.581 60.8333L323.06 52.4263Z" fill="#739CEB" stroke="#739CEB" stroke-linejoin="round" />
                                <path d="M268.581 60.8333L274.766 18.6009L227.524 67.3357L268.581 60.8333Z" fill="#769FEB" stroke="#769FEB" stroke-linejoin="round" />
                                <path d="M330.89 101.095L323.06 52.4263L281.214 102.475L330.89 101.095Z" fill="#6794ED" stroke="#6794ED" stroke-linejoin="round" />
                                <path d="M281.214 102.475L323.06 52.4263L268.581 60.8333L281.214 102.475Z" fill="#6D98EC" stroke="#6D98EC" stroke-linejoin="round" />
                                <path d="M222.392 1.52405L175.808 64.0517L227.524 67.3357L222.392 1.52405Z" fill="#7CA4EA" stroke="#7CA4EA" stroke-linejoin="round" />
                                <path d="M227.524 67.3357L166.07 105.43L226.8 117.45L227.524 67.3357Z" fill="#729BEB" stroke="#729BEB" stroke-linejoin="round" />
                                <path d="M175.808 64.0517L166.07 105.43L227.524 67.3357L175.808 64.0517Z" fill="#78A0EB" stroke="#78A0EB" stroke-linejoin="round" />
                                <path d="M274.766 18.6009L222.392 1.52405L227.524 67.3357L274.766 18.6009Z" fill="#7CA3EA" stroke="#7CA3EA" stroke-linejoin="round" />
                                <path d="M323.06 52.4263L320.494 5.20215L274.766 18.6009L323.06 52.4263Z" fill="#759EEB" stroke="#759EEB" stroke-linejoin="round" />
                                <path d="M274.766 18.6009L234.827 -35.7167L222.392 1.52406L274.766 18.6009Z" fill="#84A8E8" stroke="#84A8E8" stroke-linejoin="round" />
                                <path d="M222.392 1.52405L168.702 6.25303L175.808 64.0517L222.392 1.52405Z" fill="#82A9E9" stroke="#82A9E9" stroke-linejoin="round" />
                                <path d="M134.422 58.1405L135.475 108.714L166.07 105.43L134.422 58.1405Z" fill="#7CA2EA" stroke="#7CA2EA" stroke-linejoin="round" />
                                <path d="M134.422 58.1405L166.07 105.43L175.808 64.0517L134.422 58.1405Z" fill="#7CA3EA" stroke="#7CA3EA" stroke-linejoin="round" />
                                <path d="M137.12 17.4843L134.422 58.1405L175.808 64.0517L137.12 17.4843Z" fill="#83A8E9" stroke="#83A8E9" stroke-linejoin="round" />
                                <path d="M283.78 -35.651L234.827 -35.7167L274.766 18.6009L283.78 -35.651Z" fill="#86A8E8" stroke="#86A8E8" stroke-linejoin="round" />
                                <path d="M222.392 1.52406L189.033 -43.4669L168.702 6.25304L222.392 1.52406Z" fill="#8BAEE7" stroke="#8BAEE7" stroke-linejoin="round" />
                                <path d="M329.64 -26.8498L283.78 -35.651L320.494 5.20214L329.64 -26.8498Z" fill="#81A4E9" stroke="#81A4E9" stroke-linejoin="round" />
                                <path d="M320.494 5.20214L283.78 -35.651L274.766 18.6009L320.494 5.20214Z" fill="#7FA3E9" stroke="#7FA3E9" stroke-linejoin="round" />
                                <path d="M118.302 -34.6658L137.12 17.4844L168.702 6.25303L118.302 -34.6658Z" fill="#90B1E6" stroke="#90B1E6" stroke-linejoin="round" />
                                <path d="M168.702 6.25304L137.12 17.4844L175.808 64.0517L168.702 6.25304Z" fill="#85AAE8" stroke="#85AAE8" stroke-linejoin="round" />
                                <path d="M234.827 -35.7167L189.033 -43.4669L222.392 1.52406L234.827 -35.7167Z" fill="#8DAEE7" stroke="#8DAEE7" stroke-linejoin="round" />
                                <path d="M78.6924 24.7092L75.8632 69.8316L134.422 58.1405L78.6924 24.7092Z" fill="#8BACE7" stroke="#8BACE7" stroke-linejoin="round" />
                                <path d="M134.422 58.1405L75.8632 69.8316L135.475 108.714L134.422 58.1405Z" fill="#83A6E9" stroke="#83A6E9" stroke-linejoin="round" />
                                <path d="M78.6924 24.7092L134.422 58.1405L137.12 17.4843L78.6924 24.7092Z" fill="#8BADE7" stroke="#8BADE7" stroke-linejoin="round" />
                                <path d="M75.8632 69.8316L71.2574 107.598L135.475 108.714L75.8632 69.8316Z" fill="#84A5E9" stroke="#84A5E9" stroke-linejoin="round" />
                                <path d="M189.033 -43.4669L118.302 -34.6658L168.702 6.25304L189.033 -43.4669Z" fill="#92B2E6" stroke="#92B2E6" stroke-linejoin="round" />
                                <path d="M118.302 -34.6658L78.6924 24.7092L137.12 17.4844L118.302 -34.6658Z" fill="#92B3E6" stroke="#92B3E6" stroke-linejoin="round" />
                                <path d="M75.8632 69.8316L19.7389 110.75L71.2574 107.598L75.8632 69.8316Z" fill="#8AA8E8" stroke="#8AA8E8" stroke-linejoin="round" />
                                <path d="M118.302 -34.6658L75.2052 -31.0534L78.6924 24.7092L118.302 -34.6658Z" fill="#9AB7E4" stroke="#9AB7E4" stroke-linejoin="round" />
                                <path d="M78.6924 24.7092L20.8574 52.689L75.8632 69.8316L78.6924 24.7092Z" fill="#91AFE6" stroke="#91AFE6" stroke-linejoin="round" />
                                <path d="M75.2052 -31.0534L39.3462 12.9524L78.6924 24.7092L75.2052 -31.0534Z" fill="#9AB6E4" stroke="#9AB6E4" stroke-linejoin="round" />
                                <path d="M20.8574 52.689L19.7389 110.75L75.8632 69.8316L20.8574 52.689Z" fill="#90ACE6" stroke="#90ACE6" stroke-linejoin="round" />
                                <path d="M39.3462 12.9524L20.8574 52.689L78.6924 24.7092L39.3462 12.9524Z" fill="#96B4E5" stroke="#96B4E5" stroke-linejoin="round" />
                                <path d="M75.2052 -31.0534L34.6747 -46.6853L39.3462 12.9524L75.2052 -31.0534Z" fill="#A2BBE3" stroke="#A2BBE3" stroke-linejoin="round" />
                                <path d="M-9.14574 17.4187L-11.5144 53.2145L20.8574 52.689L-9.14574 17.4187Z" fill="#9BB6E4" stroke="#9BB6E4" stroke-linejoin="round" />
                                <path d="M-9.14575 17.4187L20.8574 52.689L39.3462 12.9524L-9.14575 17.4187Z" fill="#9BB6E4" stroke="#9BB6E4" stroke-linejoin="round" />
                                <path d="M20.8574 52.689L-11.5144 53.2144L19.7389 110.75L20.8574 52.689Z" fill="#95B0E5" stroke="#95B0E5" stroke-linejoin="round" />
                                <path d="M-18.6862 -23.8942L-9.14569 17.4187L39.3462 12.9524L-18.6862 -23.8942Z" fill="#A2BBE3" stroke="#A2BBE3" stroke-linejoin="round" />
                                <path d="M-11.5144 53.2144L-17.8966 115.545L19.7389 110.75L-11.5144 53.2144Z" fill="#93ADE6" stroke="#93ADE6" stroke-linejoin="round" />
                                <path d="M34.6747 -46.6853L-18.6862 -23.8942L39.3462 12.9524L34.6747 -46.6853Z" fill="#A5BDE2" stroke="#A5BDE2" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_1675_2270">
                                    <rect width="284" height="95" rx="6" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                )}

                <div className='flex h-[44px] justify-between mt-[16px]'>
                    <div className='flex flex-col lg:gap-[6px] gap-[8px]'>
                        <span className='text-[13px] text-[#B9B9B9] h-[16px]'>
                            {isMobile ? 'Стоимость' : ' Стоимость подписки'}
                        </span>

                        <div className='flex lg:h-[20px] h-[18px]'>
                            <span className='font-semibold lg:text-[20px] text-[18px] text-[#33331F]'>
                                {profile?.subscribe_price ? `${profile.subscribe_price} ₽` : 'Неизвестно'}&nbsp;
                            </span>
                            <span className='font-medium lg:text-[20px] text-[18px] text-[#B9B9B9]'>
                                / мес
                            </span>
                        </div>
                    </div>

                    <Button className='lg:w-[187px] w-[177px]  text-[15px] lg:text-[16px] rounded-[10px]' clickHandler={payHandler} buttonText={subscriptionActive ? 'Продлить подписку' : 'Оформить подписку'} />
                </div>
            </div>
        </div>
    )
}

export default SubscriptionCard
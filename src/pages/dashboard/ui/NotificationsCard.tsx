import React, { useState } from 'react'
import {
    AlertTriangle,
    Bell,
    Clock3,
    ExternalLink,
    MapPin,
    Package,
    Truck,
} from 'lucide-react'
import SearchInput from '../../../ui/SearchInput'
import isMobileDevice from '../../../assets/isMobileDevice'
import type Notification from '../../../types/Notification'
import type { NotificationType } from '../../../types/NotificationType'

type NotificationsCardProps = {
    notifications: Notification[],
    searchValue: string,
    onSearchChange: (value: string) => void,
    handleDeleteNotifications: (notifications?: { id: string, type: 'dobropost' | 'dobropost_bx' | 'delivery' }[]) => void,
    isDeleteNotificationsProcessing: boolean,
    isDeleteAllNotificationsProcessing: boolean
}

const NotificationsCard: React.FC<NotificationsCardProps> = ({
    notifications,
    searchValue,
    onSearchChange,
    isDeleteNotificationsProcessing,
    handleDeleteNotifications,
    isDeleteAllNotificationsProcessing
}) => {
    const [selectedNotifications, setSelectedNotifications] = useState<Notification[]>([])
    const [isCardCanSelect, setIsCardCanSelect] = useState<boolean>(false)
    const isMobile = isMobileDevice()

    function formatDate(dateString: string) {
        const date = new Date(dateString)
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/,/, '')
    }

    const filteredNotifications = (() => {
        if (!searchValue.trim()) return notifications

        const query = searchValue.toLowerCase().trim()

        return notifications.filter((notification) => {
            const title = getNotificationTitle(notification.type).toLowerCase()
            const comment = (notification.msg || notification.comment || 'Описание отсутствует').toLowerCase()

            return title.includes(query) || comment.includes(query)
        })
    })()

    function getNotificationTitle(notificationType: NotificationType) {
        if (notificationType == 'delivery') return 'Доставка по России'
        if (notificationType == 'dobropost' || notificationType == 'dobropost_bx') return 'Заказ из Китая'
        if (notificationType == 'self_redemption') return 'Заказ на себя'
        return 'Общее уведомление'
    }

    function getNotificationStatus(notification: Notification) {
        return notification.status.split('.').pop()?.toLowerCase() || ''
    }

    function getNotificationIcon(notification: Notification) {
        const iconClassName = 'w-[20px] h-[20px]'
        const status = getNotificationStatus(notification)

        if (status === 'error') {
            return <AlertTriangle className={iconClassName} strokeWidth={1.8} />
        }
        if (status === 'pickup') {
            return <MapPin className={iconClassName} strokeWidth={1.8} />
        }
        if (notification.type === 'delivery') {
            return <Truck className={iconClassName} strokeWidth={1.8} />
        }
        if (notification.type === 'dobropost' || notification.type === 'dobropost_bx') {
            return <Package className={iconClassName} strokeWidth={1.8} />
        }

        return <Bell className={iconClassName} strokeWidth={1.8} />
    }

    function renderNotificationMessage(notification: Notification) {
        const message = notification.msg || notification.comment || 'Описание отсутствует'
        const urlMatch = message.match(/https?:\/\/[^\s]+/)

        if (!urlMatch) {
            return (
                <p className='text-[14px] text-[#777777] leading-[150%]'>
                    {message}
                </p>
            )
        }

        const trackingUrl = urlMatch[0]
        const messageWithoutUrl = message
            .replace(/(?:🔎\s*)?Ссылка для отслеживания:\s*/i, '')
            .replace(trackingUrl, '')
            .trim()

        return (
            <div className='flex flex-col gap-[12px]'>
                {messageWithoutUrl && (
                    <p className='text-[14px] text-[#777777] leading-[150%]'>
                        {messageWithoutUrl}
                    </p>
                )}

                <a
                    href={trackingUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-[8px] w-fit max-w-full text-[14px] font-medium text-[#ED0028] hover:text-[#C90022] transition-colors'
                >
                    <ExternalLink
                        className='shrink-0 w-[17px] h-[17px]'
                        strokeWidth={1.9}
                        aria-hidden='true'
                    />
                    <span className='underline underline-offset-[3px] break-all'>
                        {trackingUrl}
                    </span>
                </a>
            </div>
        )
    }

    function handleSelectNotification(notification: Notification) {
        setSelectedNotifications(prev => {
            const isAlreadySelected = prev.some(item => item.id === notification.id)

            if (isAlreadySelected) {
                return prev.filter(item => item.id !== notification.id)
            }

            if (prev.length < 10) {
                return [...prev, notification]
            }

            return prev
        })
    }

    function handleDeleteButtonClick() {
        if (isMobile && !isCardCanSelect) { return setIsCardCanSelect(true) }

        handleDeleteNotifications(
            selectedNotifications
                .filter(item => item.type === 'dobropost' || item.type === 'dobropost_bx' || item.type === 'delivery')
                .map(item => ({ id: item.id, type: item.type as 'dobropost' | 'dobropost_bx' | 'delivery' }))
        )

        setIsCardCanSelect(false)
    }

    return (
        <div className='flex flex-col p-[20px] bg-white border border-[#F3F3F3] rounded-[20px]'>
            <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-[8px]'>
                    <span className='font-medium text-[16px] text-[#333333] h-[19px] mb-[5px]'>
                        Уведомления
                    </span>
                    <span className='flex items-center justify-center h-[24px] rounded-[8px] bg-[#B9B9B91A] font-medium text-[14px] text-[#B9B9B9] px-[6px] min-w-[28px]'>
                        {filteredNotifications.length}
                    </span>
                </div>
            </div>

            <div className='mt-[16px] flex flex-col lg:flex-row'>
                <SearchInput
                    className='w-full lg:w-[209px]'
                    placeholder='Ключевые слова'
                    value={searchValue}
                    onChange={onSearchChange}
                />

                <hr className='hidden lg:block !flex-0 w-[2px] h-full border-none bg-[#B9B9B9] opacity-[20%] ml-[16px] mr-[16px]' />

                <div className='flex mt-[8px] lg:mt-0 grow gap-[8px]'>
                    <button
                        type='button'
                        disabled={isDeleteNotificationsProcessing || filteredNotifications.length === 0}
                        className='flex items-center justify-center grow h-[44px] gap-[8px] border border-[#B9B9B980] rounded-[10px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 transition-opacity'
                        onClick={() => handleDeleteNotifications([])} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M10.3291 1.94341C11.4429 1.90776 12.558 1.90776 13.6719 1.94341C15.0381 1.98693 16.0828 3.12679 16.083 4.47758V5.08501L16.4619 5.12016C17.7497 5.23793 19.0324 5.40748 20.3066 5.62798C20.3498 5.63545 20.3917 5.65047 20.4287 5.67387C20.4656 5.69723 20.4973 5.72805 20.5225 5.76372C20.5477 5.7995 20.5656 5.84016 20.5752 5.88286C20.5848 5.92554 20.5856 5.96963 20.5781 6.01274C20.5707 6.05584 20.5546 6.09687 20.5312 6.13383C20.5079 6.17076 20.4781 6.20337 20.4424 6.22856C20.4066 6.25376 20.3659 6.27169 20.3232 6.2813C20.2806 6.29088 20.2364 6.29166 20.1934 6.28423H20.1904L19.9814 6.24907L19.5322 6.17387L19.498 6.62798L18.4922 19.6983C18.4422 20.3471 18.1493 20.9534 17.6719 21.3956C17.1944 21.8376 16.5677 22.083 15.917 22.0831H8.08398C7.43327 22.083 6.80657 21.8376 6.3291 21.3956C5.85165 20.9534 5.55874 20.3471 5.50879 19.6983L4.50293 6.62798L4.46777 6.17387L4.01855 6.24907L3.80957 6.28423H3.80664C3.76358 6.29166 3.7194 6.29088 3.67676 6.2813C3.63408 6.27169 3.59337 6.25376 3.55762 6.22856C3.48546 6.17763 3.43695 6.09977 3.42188 6.01274C3.40682 5.92566 3.42663 5.83596 3.47754 5.76372C4.96755 5.40722 6.25026 5.23766 7.53809 5.12016L7.91699 5.08501V4.47758C7.9172 3.12699 8.96275 1.98696 10.3291 1.94341ZM9.21387 7.83403C9.06072 7.83996 8.90973 7.87542 8.77051 7.9395C8.63141 8.00357 8.50637 8.09468 8.40234 8.20708C8.29823 8.31957 8.21721 8.45197 8.16406 8.59575C8.11104 8.73936 8.08687 8.89199 8.09277 9.04497L8.43945 18.045C8.45142 18.3542 8.58638 18.6463 8.81348 18.8565C8.92585 18.9604 9.05761 19.0417 9.20117 19.0948C9.34474 19.1478 9.49745 19.1719 9.65039 19.1661C9.80349 19.1601 9.95457 19.1237 10.0938 19.0596C10.2328 18.9956 10.358 18.9044 10.4619 18.792C10.5658 18.6797 10.6471 18.5479 10.7002 18.4043C10.7532 18.2608 10.7774 18.1081 10.7715 17.9551L10.4258 8.95512C10.4199 8.80196 10.3834 8.65101 10.3193 8.51176C10.2553 8.37262 10.1642 8.24766 10.0518 8.1436C9.93936 8.03957 9.80769 7.95846 9.66406 7.90532C9.52029 7.85218 9.36704 7.82811 9.21387 7.83403ZM14.7861 7.80864C14.6297 7.80258 14.4735 7.82831 14.3271 7.88383C14.1808 7.93936 14.0466 8.02363 13.9336 8.13188C13.8207 8.2401 13.7307 8.37002 13.6689 8.51372C13.6225 8.62173 13.5933 8.73612 13.5811 8.85258L13.5742 8.95512L13.2275 17.9551C13.2156 18.2644 13.3269 18.5659 13.5371 18.793C13.7473 19.0201 14.0394 19.154 14.3486 19.1661C14.6579 19.178 14.9593 19.0667 15.1865 18.8565C15.3853 18.6725 15.513 18.4261 15.5498 18.1602L15.5605 18.045L15.9053 9.04497L15.9043 9.04399C15.9133 8.8929 15.8945 8.74107 15.8457 8.5977C15.7952 8.44961 15.7146 8.31297 15.6104 8.19633C15.5062 8.0799 15.3796 7.98559 15.2383 7.91899C15.0966 7.85231 14.9426 7.8147 14.7861 7.80864ZM13.6504 2.60942C12.5508 2.57425 11.4502 2.57425 10.3506 2.60942C9.36178 2.64095 8.58322 3.46816 8.58301 4.47758V5.03325L9.02539 5.00688C11.0066 4.88656 12.9934 4.88656 14.9746 5.00688L15.417 5.03325V4.47758C15.4168 3.46812 14.6372 2.64093 13.6504 2.60942Z" fill="#333333" stroke="#333333" strokeWidth="0.833333" />
                        </svg>
                        <span className='order-[-1] lg:order-none font-medium text-[16px] text-[#333333]'>
                            {isDeleteAllNotificationsProcessing ? 'Удаляем...' : 'Удалить все'}
                        </span>
                    </button>

                    <button
                        type='button'
                        disabled={isDeleteNotificationsProcessing || !filteredNotifications.length || !selectedNotifications.length}
                        className='flex items-center justify-center grow h-[44px] gap-[8px] font-medium text-[16px] text-[#333333] border border-[#B9B9B980] rounded-[10px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 transition-opacity'
                        onClick={handleDeleteButtonClick}
                    >
                        {(isMobile ? ((isCardCanSelect && !isDeleteNotificationsProcessing) ? 'Удалить' : !isCardCanSelect ? 'Выбрать' : isDeleteNotificationsProcessing && 'Удаляем') : !isDeleteNotificationsProcessing ? 'Удалить' : ' Удаляем')}
                    </button>
                </div>
            </div>

            <hr className='w-full h-[1px] bg-[#B9B9B9] opacity-[20%] border-none mt-[20px]' />

            <div className='flex flex-col mt-[16px] gap-[16px] overflow-auto max-h-[668px] pr-[16px] scrollbar-thin'>
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <div key={notification.id} className='flex flex-col w-full p-[16px] rounded-[16px] bg-[#FCFCFC] border border-[#F1F1F1]'>
                            <div className='flex flex-col gap-[4px]'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-[10px] min-w-0'>
                                        <div className='flex items-center justify-center shrink-0 w-[36px] h-[36px] rounded-[10px] bg-[#FFF0F2] text-[#ED0028]'>
                                            {getNotificationIcon(notification)}
                                        </div>

                                        <div className='flex flex-col min-w-0'>
                                            <span className='font-semibold text-[16px] text-[#333333] leading-[20px]'>
                                                {getNotificationTitle(notification.type)}
                                            </span>
                                            <span className='text-[12px] text-[#B9B9B9] mt-[2px]'>
                                                Обновление статуса заказа
                                            </span>
                                        </div>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={selectedNotifications.some(notify => notify.id == notification.id)}
                                        onChange={() => handleSelectNotification(notification)}
                                        className={`
    ${isMobile ? (isCardCanSelect ? 'block' : 'hidden') : ''}
    lg:block
    relative
    w-[20px] h-[20px]
    appearance-none
    rounded-md
    border-2 border-[#B9B9B966]
    bg-transparent
    cursor-pointer
    transition-all duration-200
    checked:border-[#ED0028]
    checked:bg-[#ED0028]
    checked:after:content-['']
    checked:after:absolute
    checked:after:inset-0
    checked:after:m-auto
    checked:after:w-[12px] checked:after:h-[12px]
    checked:after:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000/svg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpolyline%20points%3D%2220%206%209%2017%204%2012%22%20fill%3D%22none%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%224%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')]
    checked:after:bg-no-repeat
    checked:after:bg-center
    checked:after:bg-contain`}
                                    />
                                </div>

                                <div className='mt-[10px]'>
                                    {renderNotificationMessage(notification)}
                                </div>
                            </div>

                            <div className='mt-[14px] pt-[12px] border-t border-[#E7E7E7] border-dashed'>
                                <div className='flex items-center gap-[4px]'>
                                    <Clock3
                                        className='w-[18px] h-[18px] text-[#B9B9B9]'
                                        strokeWidth={1.6}
                                        aria-hidden='true'
                                    />

                                    <span className='ls:text-[16px] text-[14px] text-[#B9B9B9]'>
                                        {formatDate(notification.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-center py-10 text-[#A9A9A9]'>
                        Уведомления не найдены
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationsCard

import React from 'react'
import type { Order } from '../../../types/Order'
import OrderCard from './OrderCard'

const OrderList: React.FC<{
    copyTrackNumber: (trackNumber: string) => void,
    dobropostOrders: Order[],
    searchQuery: string,
    handleSetActiveNewOrderPopup: () => void,
    handleCardClick: (order: Order) => void,
    handleSelectCardToPay: (order: Order) => void,
    checkIsCardSelected: (order: Order) => boolean,
    canCreateOrder: boolean
}> = ({ copyTrackNumber, dobropostOrders, searchQuery, handleSetActiveNewOrderPopup, handleCardClick, handleSelectCardToPay, checkIsCardSelected, canCreateOrder }) => {
    const normalizedQuery = searchQuery.toLowerCase().trim()

    const matchesSearch = (order: Order): boolean => {
        if (!normalizedQuery) return true

        const trackNumber = (order.dobropost_tracking_number || order.cn_tracking_number || '').toLowerCase()
        const description = (order.description || '').toLowerCase()
        const price = order.price?.toString() || ''

        const customer = order.customer_personal_data || null
        const fullName = customer
            ? `${customer.last_name || ''} ${customer.first_name || ''} ${customer.patronymic_name || ''}`.toLowerCase().trim()
            : 'Неизвестно'

        const searchFields = [
            trackNumber,
            description,
            price,
            fullName,
        ]

        return searchFields.some(field => field.toLocaleLowerCase().trim().includes(normalizedQuery))
    }

    const filteredDobropostOrders = dobropostOrders.filter(matchesSearch)

    const newOrders = filteredDobropostOrders.filter(o => o.actual_bx_status === 'new' || o.actual_bx_status === 'data_send')
    const checkingOrders = filteredDobropostOrders.filter(o => o.actual_bx_status === 'error')
    const chinaStorageOrders = filteredDobropostOrders.filter(o => o.actual_bx_status === 'china_storage')
    const inTransitOrders = filteredDobropostOrders.filter(o => o.actual_bx_status === 'shipped_to_russia')
    const pvzOrders = filteredDobropostOrders.filter(o => o.actual_bx_status === 'pvz' || o.actual_bx_status === 'pickup')
    const filteredDeliveryOrders = filteredDobropostOrders.filter(o => o.actual_bx_status === 'send_to_russia')

    const getTrackNumber = (order: Order) => {
        return order.dobropost_tracking_number || order.cn_tracking_number || ''
    }

    const handleCopyTrack = (order: Order) => {
        const track = getTrackNumber(order)
        if (track) {
            copyTrackNumber(track)
        }
    }

    return (
        <div className='lg:pt-[32px] pt-[20px] lg:pl-[24px] pl-[16px] lg:pr-[24px] pr-[16px] pb-[50px] lg:pb-[20px] flex gap-[12px] overflow-auto lg:max-h-[80vh]'>

            <div className='flex flex-col p-[20px] rounded-[16px] bg-white shadow-[0_0_25.8px_0_#0f0f2b26] min-w-[359px] max-w-[359px] h-fit'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-[8px]'>
                        <div className='h-[20px] w-[4px] rounded bg-[#1D7BFF]' />
                        <span className='h-[19px] font-medium text-[16px] text-[#333333]'>
                            Новые
                        </span>
                        <span className='px-[6px] h-[24px] bg-[#B9B9B91A] rounded-[8px] flex items-center justify-center font-medium text-[14px] text-[#B9B9B9] min-w-[28px]'>
                            {newOrders.length}
                        </span>
                    </div>
                    <button
                        type='button'
                        className='bg-none outline-none border-none cursor-pointer disabled:cursor-default disabled:opacity-40'
                        onClick={handleSetActiveNewOrderPopup}
                        disabled={!canCreateOrder}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clipPath="url(#clip0_351_1425)">
                                <path d="M4.92896 12H19.0711M12 19.0711V4.92893" stroke="#B9B9B9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_351_1425">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>
                <div className='mt-[24px] flex flex-col gap-[16px]'>
                    {newOrders.map(order => <OrderCard key={order.id} handleCardClick={handleCardClick} getTrackNumber={getTrackNumber} handleCopyTrack={handleCopyTrack} order={order} handleSelectCardToPay={handleSelectCardToPay} isCardSelected={checkIsCardSelected(order)} />)}
                </div>
            </div>

            <div className='flex flex-col p-[20px] rounded-[16px] bg-white shadow-[0_0_25.8px_0_#0f0f2b26] min-w-[359px] max-w-[359px] h-fit'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-[8px]'>
                        <div className='h-[20px] w-[4px] rounded bg-[#FFC31D]' />
                        <span className='h-[19px] font-medium text-[16px] text-[#333333]'>
                            Проверка
                        </span>
                        <span className='px-[6px] h-[24px] bg-[#B9B9B91A] rounded-[8px] flex items-center justify-center font-medium text-[14px] text-[#B9B9B9] min-w-[28px]'>
                            {checkingOrders.length}
                        </span>
                    </div>

                </div>
                <div className='mt-[24px] flex flex-col gap-[16px]'>
                    {checkingOrders.map(order => <OrderCard key={order.id} handleCardClick={handleCardClick} getTrackNumber={getTrackNumber} handleCopyTrack={handleCopyTrack} order={order} handleSelectCardToPay={handleSelectCardToPay} isCardSelected={checkIsCardSelected(order)} />)}
                </div>
            </div>

            <div className='flex flex-col p-[20px] rounded-[16px] bg-white shadow-[0_0_25.8px_0_#0f0f2b26] min-w-[359px] max-w-[359px] h-fit'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-[8px]'>
                        <div className='h-[20px] w-[4px] rounded bg-[#47D40A]' />
                        <span className='h-[19px] font-medium text-[16px] text-[#333333]'>
                            Склад в Китае
                        </span>
                        <span className='px-[6px] h-[24px] bg-[#B9B9B91A] rounded-[8px] flex items-center justify-center font-medium text-[14px] text-[#B9B9B9] min-w-[28px]'>
                            {chinaStorageOrders.length}
                        </span>
                    </div>

                </div>
                <div className='mt-[24px] flex flex-col gap-[16px]'>
                    {chinaStorageOrders.map(order => <OrderCard key={order.id} handleCardClick={handleCardClick} getTrackNumber={getTrackNumber} handleCopyTrack={handleCopyTrack} order={order} handleSelectCardToPay={handleSelectCardToPay} isCardSelected={checkIsCardSelected(order)} />)}
                </div>
            </div>

            <div className='flex flex-col p-[20px] rounded-[16px] bg-white shadow-[0_0_25.8px_0_#0f0f2b26] min-w-[359px] max-w-[359px] h-fit'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-[8px]'>
                        <div className='h-[20px] w-[4px] rounded bg-[#ED0028]' />
                        <span className='h-[19px] font-medium text-[16px] text-[#333333]'>
                            В пути
                        </span>
                        <span className='px-[6px] h-[24px] bg-[#B9B9B91A] rounded-[8px] flex items-center justify-center font-medium text-[14px] text-[#B9B9B9] min-w-[28px]'>
                            {inTransitOrders.length}
                        </span>
                    </div>
                </div>
                <div className='mt-[24px] flex flex-col gap-[16px]'>
                    {inTransitOrders.map(order => <OrderCard key={order.id} handleCardClick={handleCardClick} getTrackNumber={getTrackNumber} handleCopyTrack={handleCopyTrack} order={order} handleSelectCardToPay={handleSelectCardToPay} isCardSelected={checkIsCardSelected(order)} />)}
                </div>
            </div>

            <div className='flex flex-col p-[20px] rounded-[16px] bg-white shadow-[0_0_25.8px_0_#0f0f2b26] min-w-[359px] max-w-[359px] h-fit'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-[8px]'>
                        <div className='h-[20px] w-[4px] rounded bg-[#A200ED]' />
                        <span className='h-[19px] font-medium text-[16px] text-[#333333]'>
                            Пункт выдачи
                        </span>
                        <span className='px-[6px] h-[24px] bg-[#B9B9B91A] rounded-[8px] flex items-center justify-center font-medium text-[14px] text-[#B9B9B9] min-w-[28px]'>
                            {pvzOrders.length}
                        </span>
                    </div>

                </div>
                <div className='mt-[24px] flex flex-col gap-[16px]'>
                    {pvzOrders.map(order => <OrderCard key={order.id} handleCardClick={handleCardClick} getTrackNumber={getTrackNumber} handleCopyTrack={handleCopyTrack} order={order} handleSelectCardToPay={handleSelectCardToPay} isCardSelected={checkIsCardSelected(order)} />)}
                </div>
            </div>

            <div className='flex flex-col p-[20px] rounded-[16px] bg-white shadow-[0_0_25.8px_0_#0f0f2b26] min-w-[359px] max-w-[359px] h-fit'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-[8px]'>
                        <div className='h-[20px] w-[4px] rounded bg-[#1D7BFF]' />
                        <span className='h-[19px] font-medium text-[16px] text-[#333333]'>
                            Доставка
                        </span>
                        <span className='px-[6px] h-[24px] bg-[#B9B9B91A] rounded-[8px] flex items-center justify-center font-medium text-[14px] text-[#B9B9B9] min-w-[28px]'>
                            {filteredDeliveryOrders.length}
                        </span>
                    </div>

                </div>
                <div className='mt-[24px] flex flex-col gap-[16px]'>
                    {filteredDeliveryOrders.map(order => <OrderCard key={order.id} handleCardClick={handleCardClick} getTrackNumber={getTrackNumber} handleCopyTrack={handleCopyTrack} order={order} handleSelectCardToPay={handleSelectCardToPay} isCardSelected={checkIsCardSelected(order)} />)}
                </div>
            </div>

        </div>
    )
}

export default OrderList

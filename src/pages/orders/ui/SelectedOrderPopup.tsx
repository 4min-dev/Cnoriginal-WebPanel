import React from 'react'
import type { Order } from '../../../types/Order'
import type { Delivery } from '../../../types/Delivery'
import Button from '../../../ui/buttons/Button'
import { useGetDobropostOrderTrackingQuery } from '../../../redux/services/dobropostOrders'

const SelectedOrderPopup: React.FC<{
    onClose: () => void,
    selectedOrder: Order | Delivery,
    isPayProcessing: boolean,
    payHandler: () => void
}> = ({ onClose, selectedOrder, payHandler, isPayProcessing }) => {
    const isDobropostOrder = 'cn_tracking_number' in selectedOrder
    const { data: trackingResponse } = useGetDobropostOrderTrackingQuery(
        selectedOrder.id,
        {
            skip: !isDobropostOrder,
            refetchOnMountOrArgChange: true,
        }
    )
    const bitrixTrackingStatus = trackingResponse?.data?.status?.trim()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 md:items-center" onClick={onClose}>
            <div className="lg:w-[507px] w-full mx-[12px] lg:mx-0 bg-white rounded-[20px] md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-[20px] pt-[20px]">
                    <h2 className="lg:text-[28px] text-[20px] font-semibold text-[#33331F]">{('cn_tracking_number' in selectedOrder) ? selectedOrder.cn_tracking_number : (selectedOrder as any).dobropost_tracking_number}</h2>
                    <button onClick={onClose} className="cursor-pointer">
                        <svg className='w-[28px] h-[28px] lg:w-[24px] lg:h-[24px]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clipPath="url(#clip0_376_1878)">
                                <path d="M7 7L17 17M7 17L17 7" stroke="#B3B3B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_376_1878">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>

                <div className="px-[20px] mt-[24px]">
                    <div className='flex flex-col gap-[8px]'>
                        <label className="font-medium text-[13px] lg:text-[14px] text-[#B9B9B9]">
                            Описание товара
                        </label>
                        <input
                            type="text"
                            readOnly
                            value={selectedOrder.description || ''}
                            className="w-full h-[44px] flex items-center px-[12px] border border-[#B9B9B966] rounded-[10px] font-medium text-[#333333] text-[15px] lg:text-[16px] outline-none"
                        />
                    </div>

                    <div className='mt-[20px] lg:mt-[24px] flex flex-col gap-[8px]'>
                        <label className="font-medium text-[13px] lg:text-[14px] text-[#333333]">Ссылка на товар</label>
                        <input
                            type="text"
                            readOnly
                            value={('product_url' in selectedOrder) ? selectedOrder.product_url : ''}
                            className="w-full h-[44px] flex items-center px-[12px] border border-[#B9B9B966] rounded-[10px] font-medium text-[#1D7BFF] text-[15px] lg:text-[16px] outline-none"
                        />
                    </div>

                    {bitrixTrackingStatus && (
                        <div className='mt-[20px] lg:mt-[24px] flex flex-col gap-[8px]'>
                            <label className="font-medium text-[13px] lg:text-[14px] text-[#333333]">Отслеживание</label>
                            <div className='w-full min-h-[44px] flex items-center px-[12px] py-[10px] border border-[#B9B9B966] rounded-[10px] font-medium text-[#333333] text-[15px] lg:text-[16px] leading-[140%]'>
                                {bitrixTrackingStatus}
                            </div>
                        </div>
                    )}

                    <div className='mt-[20px] lg:mt-[24px] flex gap-[16px]'>
                        <div className='flex flex-col gap-[8px]'>
                            <label className="font-medium text-[13px] lg:text-[14px] text-[#333333]">Кол-во</label>

                            <input
                                type="text"
                                readOnly
                                value={('count' in selectedOrder) ? selectedOrder.count : ''}
                                className="w-full h-[44px] flex items-center px-[12px] border border-[#B9B9B966] rounded-[10px] font-medium text-[#333333] text-[15px] lg:text-[16px] outline-none"
                            />
                        </div>

                        <div className='flex flex-col gap-[8px]'>
                            <label className="font-medium text-[13px] lg:text-[14px] text-[#333333]">Стоимость</label>

                            <input
                                type="text"
                                readOnly
                                value={('count' in selectedOrder && 'cost_per_good' in selectedOrder) ? (selectedOrder.cost_per_good * selectedOrder.count) + ' ¥' : ''}
                                className="w-full h-[44px] flex items-center px-[12px] border border-[#B9B9B966] rounded-[10px] font-medium text-[#333333] text-[15px] lg:text-[16px] outline-none"
                            />
                        </div>

                        <div className='flex flex-col gap-[8px]'>
                            <label className="font-medium text-[13px] lg:text-[14px] text-[#333333]">Вес</label>
                            <input
                                type="url"
                                readOnly
                                value={
                                    selectedOrder.dimensions
                                        ? `${selectedOrder.dimensions.weight / 1000} кг.`
                                        : 'Не указан'
                                }
                                className="w-full h-[44px] flex items-center px-[12px] border border-[#B9B9B966] rounded-[10px] font-medium text-[#333333] text-[15px] lg:text-[16px] outline-none"
                            />
                        </div>
                    </div>

                    <div className='mt-[20px] lg:mt-[24px]'>
                        <img
                            src={'img_url' in selectedOrder ? selectedOrder.img_url : ''}
                            alt='product'
                            className='w-full h-[236px] object-contain rounded-[16px] border border-[#B9B9B966]'
                        />
                    </div>

                    <div className="border-t border-transparent 
            bg-[repeating-linear-gradient(90deg,#E7E7E7_0,#E7E7E7_10px,transparent_10px,transparent_28px)] 
            bg-[length:100%_1.5px] 
            bg-[position:top] 
            bg-no-repeat py-[24px] mt-[24px]">
                        <h2 className="lg:text-[22px] text-[18px] font-semibold text-[#33331F]">На кого таможим</h2>

                        <div className='mt-[20px] flex flex-col gap-[8px]'>
                            <label className="font-medium text-[13px] lg:text-[14px] text-[#333333]">ФИО</label>
                            <input
                                type="text"
                                readOnly
                                value={selectedOrder.customer_personal_data ? selectedOrder.customer_personal_data.first_name + ' ' + selectedOrder.customer_personal_data.last_name + ' ' + selectedOrder.customer_personal_data.patronymic_name : 'Не указано'}
                                className="w-full h-[44px] flex items-center px-[12px] border border-[#B9B9B966] rounded-[10px] font-medium text-[#333333] text-[15px] lg:text-[16px] outline-none"
                            />
                        </div>

                        <div className='mt-[20px] lg:mt-[24px] flex gap-[12px] lg:gap-[16px]'>
                            <div className='flex flex-col gap-[8px]'>
                                <label className="font-medium text-[13px] lg:text-[14px] text-[#333333]">Серия паспорта</label>

                                <input
                                    type="text"
                                    readOnly
                                    value={selectedOrder.customer_personal_data ? selectedOrder.customer_personal_data.passport_series : 'Не указано'}
                                    className="w-full h-[44px] flex items-center px-[12px] border border-[#B9B9B966] rounded-[10px] font-medium text-[#333333] text-[15px] lg:text-[16px] outline-none"
                                />
                            </div>

                            <div className='flex flex-col gap-[8px]'>
                                <label className="font-medium text-[13px] lg:text-[14px] text-[#333333]">Номер паспорта</label>

                                <input
                                    type="text"
                                    readOnly
                                    value={selectedOrder.customer_personal_data ? selectedOrder.customer_personal_data.passport_number : 'Не указано'}
                                    className="w-full h-[44px] flex items-center px-[12px] border border-[#B9B9B966] rounded-[10px] font-medium text-[#333333] text-[15px] lg:text-[16px] outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {
                        (!selectedOrder.paid && selectedOrder.price) ? (
                            <div className='w-full flex justify-between items-end mb-[20px]'>
                                <div className='flex flex-col gap-[4px]'>
                                    <span className='text-[14px] font-medium text-[#B9B9B9]'>
                                        К оплате
                                    </span>

                                    <span className='font-semibold text-[22px] text-[#33331F]'>
                                        {
                                            selectedOrder.price + ' ₽'
                                        }
                                    </span>
                                </div>
                                <Button disabled={isPayProcessing} clickHandler={payHandler} buttonText='Оплатить заказ' className='lg:w-[153px] w-[146px] lg:text-[16px] text-[15px] rounded-[10px] h-[44px]' />
                            </div>
                        ) : null
                    }
                </div>
            </div>
        </div >
    )
}

export default SelectedOrderPopup

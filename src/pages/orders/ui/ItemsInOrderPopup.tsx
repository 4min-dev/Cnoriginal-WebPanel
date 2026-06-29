import React, { useState } from 'react'
import type { OrderFile } from '../../../types/OrderFile'
import Button from '../../../ui/buttons/Button'

const ItemsInOrderPopup: React.FC<{ onClose: () => void, items: OrderFile[], handleCreateManyOrders: (orders: OrderFile[]) => void, isCreating: boolean }> = ({ onClose, items, handleCreateManyOrders, isCreating }) => {

    const [localItems, setLocalItems] = useState<OrderFile[]>(items)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 md:items-center" onClick={onClose}>
            <div className="lg:w-[661px] w-full mx-[16px] lg:mx-0 bg-white rounded-[20px] md:rounded-2xl shadow-2xl max-h-[90vh] lg:max-h-[554px] overflow-y-auto pt-[22px] pb-[20px] px-[20px] lg:p-[20px]" onClick={(e) => e.stopPropagation()}>
                <div className='flex items-center justify-between'>
                    <span className='font-semibold text-[20px] lg:text-[28px] text-[#33331F]'>
                        Товары в заказе
                    </span>

                    <button type='button' className='bg-none outline-none border-none cursor-pointer' onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clip-path="url(#clip0_376_1883)">
                                <path d="M7 7L17 17M7 17L17 7" stroke="#B3B3B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_376_1883">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>

                <div className='flex flex-col grow gap-[12px] mt-[24px]'>
                    {
                        (localItems && localItems.length > 0) ? localItems.map((item) => (
                            <div key={item.row_num} className='flex flex-col lg:flex-row lg:items-center gap-[16px] lg:gap-[8px]'>
                                <div className='h-[40px] lg:h-[67px] px-[14px] hidden lg:flex items-center justify-center border border-dashed border-[#B9B9B94D] rounded-[8px] lg:rounded-[16px]'>
                                    <span className='font-medium text-[22px] lg:text-[28px] text-[#B3B3B3] opacity-[70%]'>
                                        {
                                            item.row_num
                                        }
                                    </span>
                                </div>

                                <div className='flex lg:flex-row flex-col lg:items-center justify-between lg:h-[68px] lg:px-[12px] lg:rounded-[16px] lg:border lg:border-[#B9B9B94D] grow'>
                                    <div className='flex items-center'>
                                        <div className='h-[40px] px-[14px] flex lg:hidden items-center justify-center rounded-[8px] mr-[8px] bg-[#B9B9B91A]'>
                                            <span className='font-semibold text-[22px] lg:text-[28px] text-[#333333] opacity-[50%]'>
                                                {
                                                    item.row_num
                                                }
                                            </span>
                                        </div>
                                        {
                                            item.order?.image_url && (
                                                <img src={item.order.image_url} alt={item.order?.description || 'Image'} className='w-[40px] lg:w-[44px] h-[40px] lg:h-[44px] rounded-[8px] mr-[12px]' />
                                            )
                                        }

                                        <div className='flex flex-col'>
                                            <span className='font-semibold text-[16px] text-[#333333]'>
                                                {
                                                    item.order?.tracking_number || item.error?.column + ': ' + item.error?.error || 'Ошибка'
                                                }
                                            </span>

                                            <span className='text-[14px] text-[#B3B3B3]'>
                                                {
                                                    item.order?.description || 'Ошибка'
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className='gap-[24px] items-center hidden lg:flex'>
                                        <div className='flex flex-col'>
                                            <span className='text-[14px] text-[#B3B3B3] opacity-[70%]'>
                                                Стоимость
                                            </span>

                                            <span className='font-semibold text-[14px] text-[#333333]'>
                                                {
                                                    item.error ? '-' : `${item.order?.cost_per_good} ¥`
                                                }
                                            </span>
                                        </div>

                                        <div className='flex flex-col'>
                                            <span className='text-[14px] text-[#B3B3B3] opacity-[70%]'>
                                                Кол-во
                                            </span>

                                            <span className='font-semibold text-[14px] text-[#333333]'>
                                                {
                                                    item.error ? '-' : `${item.order?.count} шт`
                                                }
                                            </span>
                                        </div>

                                        <button type='button' className='bg-none outline-none border border-[#B9B9B94D] rounded-[8px] w-[36px] h-[36px] flex items-center justify-center cursor-pointer' onClick={() => setLocalItems((prev) => [...prev].filter(localItem => localItem.row_num != item.row_num))}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.75 3.73162V3.92079C14.8325 4.01978 15.9106 4.16212 16.9817 4.34746C17.0625 4.36146 17.1399 4.39126 17.2092 4.43515C17.2786 4.47904 17.3386 4.53616 17.3859 4.60326C17.4332 4.67035 17.4668 4.74609 17.4848 4.82617C17.5028 4.90624 17.5048 4.98908 17.4908 5.06996C17.4768 5.15083 17.447 5.22815 17.4031 5.29751C17.3593 5.36686 17.3021 5.42689 17.235 5.47417C17.1679 5.52146 17.0922 5.55506 17.0121 5.57307C16.932 5.59107 16.8492 5.59313 16.7683 5.57912L16.5942 5.54996L15.7567 16.4416C15.7084 17.0696 15.4248 17.6562 14.9627 18.0842C14.5006 18.5122 13.894 18.7499 13.2642 18.75H6.73667C6.10683 18.7499 5.50022 18.5122 5.03811 18.0842C4.576 17.6562 4.29246 17.0696 4.24417 16.4416L3.40584 5.54996L3.23167 5.57912C3.1508 5.59313 3.06796 5.59107 2.98788 5.57307C2.90781 5.55506 2.83206 5.52146 2.76497 5.47417C2.62948 5.37869 2.53746 5.23329 2.50917 5.06996C2.48088 4.90663 2.51863 4.73875 2.61412 4.60326C2.70961 4.46776 2.85501 4.37575 3.01834 4.34746C4.08939 4.16189 5.16749 4.01956 6.25001 3.92079V3.73162C6.25001 2.42829 7.26084 1.31496 8.59667 1.27246C9.53227 1.24251 10.4686 1.24251 11.4042 1.27246C12.74 1.31496 13.75 2.42829 13.75 3.73162ZM8.63667 2.52162C9.54561 2.49255 10.4552 2.49255 11.3642 2.52162C11.9917 2.54162 12.5 3.06996 12.5 3.73162V3.82579C10.8349 3.72466 9.16514 3.72466 7.50001 3.82579V3.73162C7.50001 3.06996 8.00751 2.54162 8.63667 2.52162ZM8.34084 7.47579C8.33767 7.39371 8.31836 7.31307 8.28402 7.23845C8.24967 7.16384 8.20097 7.09672 8.14069 7.04093C8.08041 6.98513 8.00973 6.94176 7.93269 6.91328C7.85565 6.88481 7.77375 6.87178 7.69167 6.87496C7.6096 6.87813 7.52895 6.89744 7.45433 6.93178C7.37972 6.96612 7.3126 7.01482 7.25681 7.0751C7.20102 7.13538 7.15764 7.20606 7.12917 7.28311C7.10069 7.36015 7.08767 7.44205 7.09084 7.52412L7.38001 15.0241C7.38642 15.1898 7.45837 15.3461 7.58003 15.4587C7.64027 15.5144 7.71091 15.5578 7.7879 15.5862C7.86489 15.6147 7.94673 15.6277 8.02876 15.6245C8.11078 15.6214 8.19137 15.6021 8.26593 15.5677C8.3405 15.5334 8.40757 15.4848 8.46332 15.4245C8.51908 15.3643 8.56242 15.2936 8.59088 15.2166C8.61933 15.1397 8.63235 15.0578 8.62917 14.9758L8.34084 7.47579ZM12.9075 7.52412C12.9136 7.44047 12.9028 7.35644 12.8758 7.27705C12.8487 7.19765 12.806 7.12452 12.7501 7.06199C12.6942 6.99947 12.6262 6.94884 12.5504 6.91311C12.4745 6.87739 12.3922 6.85731 12.3083 6.85406C12.2245 6.85082 12.1409 6.86448 12.0625 6.89423C11.9841 6.92397 11.9124 6.9692 11.8519 7.02722C11.7913 7.08523 11.743 7.15484 11.7099 7.23191C11.6768 7.30898 11.6595 7.39192 11.6592 7.47579L11.37 14.9758C11.3636 15.1416 11.4233 15.3031 11.536 15.4248C11.6487 15.5466 11.8051 15.6185 11.9708 15.625C12.1366 15.6314 12.2981 15.5717 12.4199 15.459C12.5416 15.3463 12.6136 15.1899 12.62 15.0241L12.9075 7.52412Z" fill="#B3B3B3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className='flex gap-[24px] items-center lg:hidden lg:pt-0 pt-[16px] border-t border-[#B9B9B933] lg:border-none'>
                                    <div className='flex flex-col'>
                                        <span className='text-[14px] text-[#B3B3B3] opacity-[70%]'>
                                            Стоимость
                                        </span>

                                        <span className='font-semibold text-[14px] text-[#333333]'>
                                            {
                                                item.error ? '-' : `${item.order?.cost_per_good} ¥`
                                            }
                                        </span>
                                    </div>

                                    <div className='flex flex-col'>
                                        <span className='text-[14px] text-[#B3B3B3] opacity-[70%]'>
                                            Кол-во
                                        </span>

                                        <span className='font-semibold text-[14px] text-[#333333]'>
                                            {
                                                item.error ? '-' : `${item.order?.count} шт`
                                            }
                                        </span>
                                    </div>

                                    <button type='button' className='bg-none outline-none border border-[#B9B9B94D] rounded-[8px] w-[36px] h-[36px] flex items-center justify-center cursor-pointer ml-auto lg:ml-0' onClick={() => setLocalItems((prev) => [...prev].filter(localItem => localItem.row_num != item.row_num))}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.75 3.73162V3.92079C14.8325 4.01978 15.9106 4.16212 16.9817 4.34746C17.0625 4.36146 17.1399 4.39126 17.2092 4.43515C17.2786 4.47904 17.3386 4.53616 17.3859 4.60326C17.4332 4.67035 17.4668 4.74609 17.4848 4.82617C17.5028 4.90624 17.5048 4.98908 17.4908 5.06996C17.4768 5.15083 17.447 5.22815 17.4031 5.29751C17.3593 5.36686 17.3021 5.42689 17.235 5.47417C17.1679 5.52146 17.0922 5.55506 17.0121 5.57307C16.932 5.59107 16.8492 5.59313 16.7683 5.57912L16.5942 5.54996L15.7567 16.4416C15.7084 17.0696 15.4248 17.6562 14.9627 18.0842C14.5006 18.5122 13.894 18.7499 13.2642 18.75H6.73667C6.10683 18.7499 5.50022 18.5122 5.03811 18.0842C4.576 17.6562 4.29246 17.0696 4.24417 16.4416L3.40584 5.54996L3.23167 5.57912C3.1508 5.59313 3.06796 5.59107 2.98788 5.57307C2.90781 5.55506 2.83206 5.52146 2.76497 5.47417C2.62948 5.37869 2.53746 5.23329 2.50917 5.06996C2.48088 4.90663 2.51863 4.73875 2.61412 4.60326C2.70961 4.46776 2.85501 4.37575 3.01834 4.34746C4.08939 4.16189 5.16749 4.01956 6.25001 3.92079V3.73162C6.25001 2.42829 7.26084 1.31496 8.59667 1.27246C9.53227 1.24251 10.4686 1.24251 11.4042 1.27246C12.74 1.31496 13.75 2.42829 13.75 3.73162ZM8.63667 2.52162C9.54561 2.49255 10.4552 2.49255 11.3642 2.52162C11.9917 2.54162 12.5 3.06996 12.5 3.73162V3.82579C10.8349 3.72466 9.16514 3.72466 7.50001 3.82579V3.73162C7.50001 3.06996 8.00751 2.54162 8.63667 2.52162ZM8.34084 7.47579C8.33767 7.39371 8.31836 7.31307 8.28402 7.23845C8.24967 7.16384 8.20097 7.09672 8.14069 7.04093C8.08041 6.98513 8.00973 6.94176 7.93269 6.91328C7.85565 6.88481 7.77375 6.87178 7.69167 6.87496C7.6096 6.87813 7.52895 6.89744 7.45433 6.93178C7.37972 6.96612 7.3126 7.01482 7.25681 7.0751C7.20102 7.13538 7.15764 7.20606 7.12917 7.28311C7.10069 7.36015 7.08767 7.44205 7.09084 7.52412L7.38001 15.0241C7.38642 15.1898 7.45837 15.3461 7.58003 15.4587C7.64027 15.5144 7.71091 15.5578 7.7879 15.5862C7.86489 15.6147 7.94673 15.6277 8.02876 15.6245C8.11078 15.6214 8.19137 15.6021 8.26593 15.5677C8.3405 15.5334 8.40757 15.4848 8.46332 15.4245C8.51908 15.3643 8.56242 15.2936 8.59088 15.2166C8.61933 15.1397 8.63235 15.0578 8.62917 14.9758L8.34084 7.47579ZM12.9075 7.52412C12.9136 7.44047 12.9028 7.35644 12.8758 7.27705C12.8487 7.19765 12.806 7.12452 12.7501 7.06199C12.6942 6.99947 12.6262 6.94884 12.5504 6.91311C12.4745 6.87739 12.3922 6.85731 12.3083 6.85406C12.2245 6.85082 12.1409 6.86448 12.0625 6.89423C11.9841 6.92397 11.9124 6.9692 11.8519 7.02722C11.7913 7.08523 11.743 7.15484 11.7099 7.23191C11.6768 7.30898 11.6595 7.39192 11.6592 7.47579L11.37 14.9758C11.3636 15.1416 11.4233 15.3031 11.536 15.4248C11.6487 15.5466 11.8051 15.6185 11.9708 15.625C12.1366 15.6314 12.2981 15.5717 12.4199 15.459C12.5416 15.3463 12.6136 15.1899 12.62 15.0241L12.9075 7.52412Z" fill="#B3B3B3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )) : <div className='flex flex-col items-center w-full justify-center gap-[16px] py-[40px]'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM7.75736 7.75736C8.1499 7.36482 8.78206 7.36482 9.1746 7.75736L12 10.5821L14.8254 7.75736C15.2189 7.36482 15.8511 7.36482 16.2436 7.75736C16.6362 8.14991 16.6362 8.78207 16.2436 9.17461L12.7071 12.7071C12.3166 13.0976 11.6834 13.0976 11.2929 12.7071L7.75736 9.17461C7.36482 8.78207 7.36482 8.14991 7.75736 7.75736Z" fill="#B9B9B9" />
                            </svg>
                            <span className='text-[18px] text-[#B9B9B9]'>
                                Товары в заказе отсутствуют
                            </span>
                        </div>
                    }

                    <Button buttonText={isCreating ? 'Заказ создаётся' : 'Создать заказ'} clickHandler={() => handleCreateManyOrders(localItems)} className='grow h-[44px] text-[16px] text-[#FCFDFF] mt-[16px] lg:mt-[24px] rounded-[10px]' disabled={isCreating} />
                </div>
            </div>

        </div>
    )
}

export default ItemsInOrderPopup

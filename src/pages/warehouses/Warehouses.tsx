import React, { useState } from 'react'
import { useGetWarehousesQuery } from '../../redux/services/warehousesService'
import { copyToClipboard } from '../../utils/text/copyToClipboard'
import Popup from '../../ui/popup/Popup'
import SuccessIcon from '../../ui/icons/SuccessIcon'
import WarehouseCard from './ui/WarehouseCard'
import isMobileDevice from '../../assets/isMobileDevice'
import { useAuth } from '../../hooks/useAuth'

const Warehouses: React.FC = () => {
    const { user } = useAuth()
    const [isCopied, setIsCopied] = useState(false)
    const { data: warehousesData } = useGetWarehousesQuery()

    function handleCopyAddress(value: string) {
        copyToClipboard(value)
        setIsCopied(true)
    }

    function formatWarehouseAddress(value: string) {
        const username = user?.username || ''
        const address = value.replace(/\{username\}/g, username)

        return username ? `${username}\n${address}` : address
    }

    return (
        <>
            {isCopied && (
                <Popup
                    icon={<SuccessIcon />}
                    title='Адрес скопирован!'
                    description='Адрес успешно скопирован в буфер обмена.'
                    buttonText='Хорошо'
                    buttonHandler={() => setIsCopied(false)}
                    closeHandler={() => setIsCopied(false)}
                    popupClassname='lg:w-[480px]'
                />
            )}

            <div className='flex flex-col justify-between grow gap-[12px] mt-[24px] mr-[16px] lg:mr-[24px] ml-[16px] lg:ml-[24px]'>
                <a href="https://cnoriginal.ru/%d0%b7%d0%b0%d0%bf%d1%80%d0%b5%d1%89%d0%b5%d0%bd%d0%bd%d1%8b%d0%b5-%d0%ba-%d0%b2%d0%b2%d0%be%d0%b7%d1%83-%d1%82%d0%be%d0%b2%d0%b0%d1%80%d1%8b/"
                    target="_blank"
                    rel="noopener noreferrer" className='p-[20px] bg-[#FFFFFF] shadow-[0px_0px_25.8px_0px_rgba(15,15,43,0.05)] rounded-[20px] flex justify-between'>
                    <div className='flex flex-col gap-[8px]'>
                        <span className='font-semibold text-[20px] lg:text-[24px] text-[#333333]'>
                            Запрещёнка
                        </span>

                        <span className='text-[14px] lg:text-[16px] text-[#B9B9B9]'>
                            Товары, запрещенные к ввозу в Российскую Федерацию.
                        </span>
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.5667 9.55837C13.6837 9.67556 13.7495 9.83441 13.7495 10C13.7495 10.1657 13.6837 10.3245 13.5667 10.4417L7.3167 16.6917C7.19822 16.8021 7.04152 16.8622 6.8796 16.8593C6.71768 16.8565 6.56319 16.7909 6.44868 16.6764C6.33417 16.5619 6.26858 16.4074 6.26572 16.2455C6.26287 16.0836 6.32297 15.9268 6.43337 15.8084L12.2417 10L6.43337 4.1917C6.32297 4.07322 6.26287 3.91652 6.26572 3.7546C6.26858 3.59268 6.33417 3.43819 6.44868 3.32368C6.56319 3.20917 6.71768 3.14358 6.8796 3.14072C7.04152 3.13787 7.19822 3.19797 7.3167 3.30837L13.5667 9.55837Z" fill="#B9B9B9" />
                    </svg>
                </a>

                <div className='p-[20px] lg:p-[24px] bg-[#FFFFFF] shadow-[0px_0px_25.8px_0px_rgba(15,15,43,0.05)] rounded-[20px] flex flex-col gap-[24px]'>
                    <span className='font-semibold text-[20px] lg:text-[24px] text-[#333333]'>
                        {isMobileDevice() ? 'Склады в Китае' : 'Склады'}
                    </span>

                    {warehousesData && warehousesData.data.data.length > 0 ? (
                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-[24px] overflow-y-auto pr-[8px] lg:pr-[24px] `}>
                            {warehousesData.data.data.map((warehouse) => {
                                const formattedWarehouse = {
                                    ...warehouse,
                                    address: formatWarehouseAddress(warehouse.address),
                                }

                                return (
                                    <WarehouseCard
                                        key={warehouse.id}
                                        warehouse={formattedWarehouse}
                                        handleCopyAddress={handleCopyAddress}
                                    />
                                )
                            })}
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center gap-[16px] py-[40px]'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM7.75736 7.75736C8.1499 7.36482 8.78206 7.36482 9.1746 7.75736L12 10.5821L14.8254 7.75736C15.2189 7.36482 15.8511 7.36482 16.2436 7.75736C16.6362 8.14991 16.6362 8.78207 16.2436 9.17461L12.7071 12.7071C12.3166 13.0976 11.6834 13.0976 11.2929 12.7071L7.75736 9.17461C7.36482 8.78207 7.36482 8.14991 7.75736 7.75736Z" fill="#B9B9B9" />
                            </svg>
                            <span className='text-[18px] text-[#B9B9B9]'>
                                Транзакции не найдены
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Warehouses

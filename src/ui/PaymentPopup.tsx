import React, { useState } from 'react'
import Button from './buttons/Button'
import isMobileDevice from '../assets/isMobileDevice'

type PaymentPopupProps = {
    sum: string,
    handleSumChange: (value: string) => void,
    isOpen: boolean,
    closeHandler: () => void,
    onCreatePayment: (amount: string) => Promise<void>,
    isPayProcessing: boolean
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({ isOpen, closeHandler, sum, handleSumChange, onCreatePayment, isPayProcessing }) => {
    const isMobile = isMobileDevice()
    const [email, setEmail] = useState<string>("")

    if (!isOpen) return null

    return (
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/60 z-[999] flex items-center justify-center" onClick={closeHandler}>
            <div
                className="p-[20px] lg:p-[28px] border border-[#F3F3F3] rounded-[20px] shadow-[0px_0px_25.8px_0px_#0F0F2B0D] lg:mr-0 lg:ml-0 mr-[16px] ml-[16px] relative bg-white flex flex-col lg:w-[523px] w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type='button'
                    className='bg-none outline-none border-none cursor-pointer absolute top-[20px] right-[20px]'
                    onClick={closeHandler}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clipPath="url(#clip0_1326_17265)">
                            <path d="M7 7L17 17M7 17L17 7" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1326_17265">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>

                <span className='font-bold text-[20px] lg:text-[28px] text-[#33331F]'>
                    Пополнение баланса
                </span>

                <div className='mt-[16px] flex flex-col gap-[8px]'>
                    <input
                        type="text"
                        value={sum}
                        onChange={(e) => {
                            if (e.target.value != '0') { handleSumChange(e.target.value.replace(/\D/g, '')) }
                        }}
                        maxLength={15}
                        placeholder="Введите сумму"
                        className="w-full px-[12px] text-[14px] lg:text-[15px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none"
                    />

                    <div className='flex items-center justify-between'>
                        <span className='text-[13px] lg:text-[14px] text-[#B9B9B9]'>
                            {isMobile ? 'Рекомендуемая сумма' : 'Рекомендуемая сумма пополнения'}
                        </span>
                        <span className='font-medium text-[13px] lg:text-[14px] text-[#ED0028]'>
                            39 900 ₽
                        </span>
                    </div>
                </div>

                <div className='mt-[24px] flex flex-col gap-[8px]'>
                    <label className='font-medium text-[13px] lg:text-[14px] text-[#333333] after:content-["*"] after:text-[#ED0028] after:ml-[2px]'>
                        Эл. почта
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="@gmail.com"
                        className="w-full px-[12px] h-[44px] text-[14px] lg:text-[15px] border border-[#E0E0E0] rounded-lg focus:outline-none"
                    />
                </div>

                <div className='flex items-center justify-between mt-[24px] lg:mt-[28px]'>
                    <div className='flex flex-col gap-[4px]'>
                        <span className='font-medium text-[14px] text-[#B9B9B9]'>
                            К оплате
                        </span>
                        <span className='font-semibold text-[20px] lg:text-[22px] text-[#33331F]'>
                            {sum ? `${Number(sum).toLocaleString('ru-RU')} ₽` : '0 ₽'}
                        </span>
                    </div>

                    <Button
                        className='w-[173px] lg:w-[183px] h-[44px] rounded-[10px] font-medium text-[16px]'
                        buttonText={isPayProcessing ? 'Обработка...' : 'Пополнить аккаунт'}
                        clickHandler={() => onCreatePayment(sum)}
                        disabled={!sum || !email || !email.includes('@') || isPayProcessing || Number(sum) <= 0}
                    />
                </div>
            </div>
        </div>
    )
}

export default PaymentPopup
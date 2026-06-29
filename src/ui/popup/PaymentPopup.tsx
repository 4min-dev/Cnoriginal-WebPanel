import React from 'react'
import Button from '../buttons/Button'

const PaymentPopup: React.FC<{ closeHandler: () => void }> = ({ closeHandler }) => {
    const [payValue, setPayValue] = React.useState<string>("")
    const [email, setEmail] = React.useState<string>("")

    return (
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/60 z-[999] flex items-center justify-center" onClick={closeHandler}>
            <div
                className={`p-[28px] border border-[#F3F3F3] rounded-[20px] 
             shadow-[0px_0px_25.8px_0px_#0F0F2B0D] lg:mr-0 lg:ml-0 mr-[16px] ml-[16px] relative bg-white flex flex-col  w-[523px]`} onClick={(e) => e.stopPropagation()}>
                <button type='button' className='bg-none outline-none border-none cursor-pointer absolute top-[20px] right-[20px]' onClick={closeHandler}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clip-path="url(#clip0_1326_17265)">
                            <path d="M7 7L17 17M7 17L17 7" stroke="#B3B3B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
                        type="number"
                        onChange={(e) => setPayValue(e.target.value)}
                        value={payValue}
                        placeholder="Введите сумму"
                        className="w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none"
                    />

                    <div className='flex items-center justify-between'>
                        <span className='text-[14px] text-[#B9B9B9]'>
                            Рекомендуемая сумма пополнения
                        </span>

                        <span className='font-medium text-[14px] text-[#ED0028]'>
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
                        className="w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none"
                    />
                </div>

                <div className='flex items-center justify-between mt-[28px]'>
                    <div className='flex flex-col gap-[4px]'>
                        <span className='font-medium text-[14px] text-[#B9B9B9]'>
                            К оплате
                        </span>

                        <span className='font-semibold text-[22px] text-[#33331F]'>
                            1 500 ₽
                        </span>
                    </div>

                    <Button className='w-[183px] h-[44px] rounded-[10px] font-medium text-[16px]' buttonText='Пополнить аккаунт' clickHandler={() => ''} disabled={!payValue || !email || !email.includes('@')} />
                </div>
            </div>
        </div>
    )
}

export default PaymentPopup

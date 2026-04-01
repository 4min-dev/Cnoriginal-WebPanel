import React from 'react'

const Popup = ({ icon, title, description, buttonText, buttonHandler, popupClassname, closeHandler, buttonDisabled }: { icon: React.ReactNode; title: string; description: string; buttonText: string; buttonHandler: () => void, popupClassname?: string, closeHandler: () => void, buttonDisabled?: boolean }) => {
    return (
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/60 z-[999] flex items-center justify-center" onClick={closeHandler}>
            <div
                className={`p-[28px] border border-[#F3F3F3] rounded-[20px] 
             shadow-[0px_0px_25.8px_0px_#0F0F2B0D] lg:mr-0 lg:ml-0 mr-[16px] ml-[16px] relative bg-white flex flex-col items-center justify-center ${popupClassname}`} onClick={(e) => e.stopPropagation()}>
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

                <div className='flex flex-col gap-[12px] items-center'>
                    {icon}

                    <div className='flex flex-col lg:gap-[9px] gap-[8px] items-center'>
                        <span className='font-bold text-[20px] lg:text-[28px] text-[#33331F]'>
                            {title}
                        </span>

                        <span className='text-[14px] lg:text-[18px] text-[#B9B9B9] line-[140%] text-center'>
                            {description}
                        </span>
                    </div>
                </div>

                <button type='button' className='mt-[24px] lg:mt-[28px] h-[44px] rounded-[10px] bg-[#ED0028] font-medium text-[15px] lg:text-[16px] text-[#FCFDFF] px-[16px] cursor-pointer' onClick={buttonHandler} disabled={buttonDisabled}>
                    {buttonText}
                </button>
            </div>
        </div>
    )
}

export default Popup

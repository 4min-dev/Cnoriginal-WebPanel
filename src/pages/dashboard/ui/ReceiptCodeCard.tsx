import React from 'react'
import { QrCode, ScanLine } from 'lucide-react'

type ReceiptCodeCardProps = {
    code?: string
    qr?: string
    className?: string
}

const ReceiptCodeCard: React.FC<ReceiptCodeCardProps> = ({
    code,
    qr,
    className = '',
}) => {
    return (
        <section className={`flex flex-col bg-white border border-[#F3F3F3] rounded-[20px] py-[20px] px-[18px] shadow-[0_0_26px_0_rgba(15,15,43,0.05)] lg:min-h-[385px] ${className}`}>
            <div className="flex items-center gap-[10px]">
                <div className="flex items-center justify-center shrink-0 w-[40px] h-[40px] rounded-[12px] bg-[#FFF0F2] text-[#ED0028]">
                    <QrCode size={21} strokeWidth={1.8} aria-hidden="true" />
                </div>

                <div className="flex flex-col min-w-0">
                    <h2 className="font-semibold text-[18px] text-[#333333] leading-[22px]">
                        Код получения
                    </h2>
                    <span className="text-[13px] text-[#B9B9B9] mt-[3px]">
                        Для получения заказов на складе
                    </span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-start grow gap-[12px] mt-[20px]">
                <div className="flex items-center justify-center shrink-0 w-full lg:max-w-[230px] aspect-square lg:aspect-auto rounded-[20px] lg:rounded-[16px] border border-[#F3F3F3] bg-white overflow-hidden">
                    {qr ? (
                        <img
                            src={`data:image/png;base64,${qr}`}
                            alt="QR-код получения"
                            className="w-full h-full lg:w-[200.99px] lg:h-[200.99px] object-contain"
                        />
                    ) : (
                        <div className="w-[200.99px] h-[200.99px] rounded-[10px] bg-[#F6F6F6] animate-pulse" />
                    )}
                </div>

                <div className="flex flex-col justify-center w-full min-w-0 p-[20px] rounded-[16px] border border-[#F3F3F3] bg-[#FCFCFC]">
                    <span className="text-[13px] text-[#B9B9B9] leading-[16px]">
                        Ваш код получения
                    </span>

                    <span className="font-semibold text-[28px] text-[#333333] leading-[34px] mt-[7px] break-all">
                        {code || 'Загрузка...'}
                    </span>

                    <div className="flex items-start gap-[9px] mt-[20px] pt-[16px] border-t border-dashed border-[#E4E4E4]">
                        <div className="flex items-center justify-center shrink-0 w-[30px] h-[30px] rounded-[9px] bg-[#FFF0F2] text-[#ED0028]">
                            <ScanLine size={17} strokeWidth={1.8} aria-hidden="true" />
                        </div>

                        <p className="text-[14px] text-[#777777] leading-[19px]">
                            Покажите QR-код сотруднику пункта выдачи при получении заказов
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ReceiptCodeCard

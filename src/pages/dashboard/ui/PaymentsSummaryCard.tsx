import React from 'react'
import { ArrowRight, CheckCircle2, CreditCard, Package, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { User } from '../../../types/User'

type PaymentsSummaryCardProps = {
    profile?: User
}

type PaymentTileProps = {
    title: string
    orders: number
    sum: number
    icon: React.ReactNode
}

const formatRub = (value?: number) => {
    const amount = Number(value ?? 0)
    return `${Math.max(0, amount).toLocaleString('ru-RU')} ₽`
}

const formatOrdersCount = (value?: number) => {
    const count = Number(value ?? 0)

    if (count === 1) return '1 заказ'
    if (count > 1 && count < 5) return `${count} заказа`
    return `${count} заказов`
}

const PaymentTile: React.FC<PaymentTileProps> = ({ title, orders, sum, icon }) => {
    const hasDebt = sum > 0

    return (
        <div className={`flex flex-col min-h-[84px] p-[13px] rounded-[14px] border ${
            hasDebt ? 'border-[#FFE0E5] bg-[#FFF9FA]' : 'border-[#F3F3F3] bg-[#FCFCFC]'
        }`}>
            <div className="flex items-center justify-between gap-[10px]">
                <div className="flex items-center gap-[7px] min-w-0">
                    <span className={hasDebt ? 'text-[#ED0028] shrink-0' : 'text-[#B9B9B9] shrink-0'}>
                        {icon}
                    </span>
                    <span className="text-[13px] text-[#777777] leading-[16px] truncate">
                        {title}
                    </span>
                </div>
                <span className={`text-[12px] leading-[15px] shrink-0 ${
                    hasDebt ? 'text-[#ED0028]' : 'text-[#B9B9B9]'
                }`}>
                    {formatOrdersCount(orders)}
                </span>
            </div>

            <span className={`font-semibold text-[20px] leading-[24px] mt-[13px] ${
                hasDebt ? 'text-[#ED0028]' : 'text-[#333333]'
            }`}>
                {formatRub(sum)}
            </span>
        </div>
    )
}

const PaymentsSummaryCard: React.FC<PaymentsSummaryCardProps> = ({ profile }) => {
    const chinaSum = profile?.china_to_pay_sum ?? profile?.to_pay_sum ?? 0
    const chinaOrders = profile?.china_to_pay_orders ?? profile?.to_pay_orders ?? 0
    const deliverySum = profile?.delivery_to_pay_sum ?? 0
    const deliveryOrders = profile?.delivery_to_pay_orders ?? 0
    const totalSum = chinaSum + deliverySum
    const hasDebt = totalSum > 0

    return (
        <section className={`flex flex-col p-[18px] bg-white border rounded-[20px] ${
            hasDebt
                ? 'border-[#FFE0E5] shadow-[0_10px_30px_0_rgba(237,0,40,0.08)]'
                : 'border-[#F3F3F3] shadow-[0_0_26px_0_rgba(15,15,43,0.05)]'
        }`}>
            {hasDebt && <div className="h-[4px] mb-[16px] rounded-full bg-[#ED0028]" />}

            <div className="flex items-start justify-between gap-[12px]">
                <div className="flex items-center gap-[10px] min-w-0">
                    <div className={`flex items-center justify-center shrink-0 w-[40px] h-[40px] rounded-[12px] ${
                        hasDebt ? 'bg-[#FFF0F2] text-[#ED0028]' : 'bg-[#F0FFF0] text-[#24C300]'
                    }`}>
                        {hasDebt ? (
                            <CreditCard size={21} strokeWidth={1.8} aria-hidden="true" />
                        ) : (
                            <CheckCircle2 size={21} strokeWidth={1.8} aria-hidden="true" />
                        )}
                    </div>

                    <div className="flex flex-col min-w-0">
                        <h2 className="font-semibold text-[18px] text-[#333333] leading-[22px]">
                            {hasDebt ? 'К оплате сейчас' : 'Все оплачено'}
                        </h2>
                        <span className="text-[13px] text-[#B9B9B9] mt-[3px]">
                            {hasDebt ? 'Чтобы заказы двигались дальше' : 'Новых оплат нет'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                    <span className="text-[13px] text-[#B9B9B9] leading-[16px]">
                        Всего
                    </span>
                    <span className={`font-semibold text-[26px] leading-[31px] mt-[2px] ${
                        hasDebt ? 'text-[#ED0028]' : 'text-[#33331F]'
                    }`}>
                        {formatRub(totalSum)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[8px] mt-[12px]">
                <PaymentTile
                    title="Китай"
                    orders={chinaOrders}
                    sum={chinaSum}
                    icon={<Package size={16} strokeWidth={1.8} aria-hidden="true" />}
                />
                <PaymentTile
                    title="РФ"
                    orders={deliveryOrders}
                    sum={deliverySum}
                    icon={<Truck size={16} strokeWidth={1.8} aria-hidden="true" />}
                />
            </div>

            {hasDebt && (
                <Link
                    to="/orders"
                    className="flex items-center justify-center gap-[8px] h-[44px] mt-[12px] rounded-[14px] bg-[#ED0028] text-white text-[15px] font-semibold leading-[18px] shadow-[0_8px_18px_0_rgba(237,0,40,0.16)] transition hover:bg-[#D90024] active:scale-[0.99]"
                >
                    Оплатить сейчас
                    <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                </Link>
            )}
        </section>
    )
}

export default PaymentsSummaryCard

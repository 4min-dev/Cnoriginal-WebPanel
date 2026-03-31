import React, { useMemo } from 'react'
import DashboardHeading from './ui/DashboardHeading'
import SubscriptionCard from './ui/SubscriptionCard'
import BalanceCard from './ui/BalanceCard'
import type { BalanceAnalyticsObject } from '../../types/BalanceAnalyticsObject'
import NotificationsCard from './ui/NotificationsCard'
import ActivityCard from './ui/ActivityCard'
import BannerCard from './ui/BannerCard'
import MobileHeader from '../orders/ui/MobileHeader'
import ReferralCard from './ui/ReferralCard'

import { useGetReferralsQuery } from '../../redux/services/referralService'
import { useAppSelector } from '../../hooks/useAppDispatch'
import { useGetDobropostOrdersQuery } from '../../redux/services/dobropostOrders'
import { useGetNotificationsQuery } from '../../redux/services/notificationsService'
import { useGetBalanceQuery } from '../../redux/services/balanceService'
import { useGetDeliveryOrdersQuery } from '../../redux/services/deliveryService'

const Dashboard: React.FC = () => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
    const accessToken = useAppSelector((state) => state.auth.accessToken)

    const [selectedPeriod, setSelectedPeriod] = React.useState<{
        start: Date | null
        end: Date | null
    }>({
        start: null,
        end: null,
    })

    const formatDate = (date: Date | null): string | undefined => {
        if (!date) return undefined
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const startDateStr = formatDate(selectedPeriod.start)
    const endDateStr = formatDate(selectedPeriod.end)

    const { data: balanceResponse } = useGetBalanceQuery(
        {
            start_date: startDateStr,
            end_date: endDateStr
        },
        {
            skip: !isAuthenticated || !accessToken,
        }
    )

    const { data: referrals } = useGetReferralsQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })

    const { data: dobropostOrders } = useGetDobropostOrdersQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })

    const { data: deliveryOrders } = useGetDeliveryOrdersQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })

    const { data: notifications } = useGetNotificationsQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })

    const balanceData = useMemo<BalanceAnalyticsObject[]>(() => {
        const monthsRu = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

        const monthly = monthsRu.map((month) => ({
            month,
            replenishment: 0,
            spending: 0,
        }))

        const transactions = balanceResponse?.data ?? []

        transactions.forEach((tx) => {
            try {
                const date = new Date(tx.created_at)
                if (isNaN(date.getTime())) return

                const monthIndex = date.getMonth()
                const amount = Number(tx.amount) || 0

                if (tx.type === 'plus') {
                    monthly[monthIndex].replenishment += amount
                } else if (tx.type === 'minus') {
                    monthly[monthIndex].spending += Math.abs(amount)
                }
            } catch (err) {
                console.log(err)
            }
        })

        return monthly.map((item) => ({
            ...item,
            replenishment: Number(item.replenishment.toFixed(2)),
            spending: Number(item.spending.toFixed(2)),
        }))
    }, [balanceResponse])

    return (
        <div className="flex min-h-screen overflow-hidden w-full">
            <div className="flex flex-col pt-[50px] pr-[16px] lg:pt-[23px] lg:pr-[24px] w-full overflow-hidden">
                <MobileHeader />
                <DashboardHeading
                    dobropostData={dobropostOrders?.data?.dobropost || []}
                    deliveryData={deliveryOrders?.data?.delivery || []}
                />

                <div className="flex flex-col lg:flex-row lg:mt-[25px] lg:ml-[24px] lg:gap-[12px] mt-[16px] gap-[16px]">
                    <div className="flex flex-col lg:max-w-[49.455%] lg:gap-[12px] lg:pb-[71px] gap-[16px]">
                        <SubscriptionCard />
                        <ReferralCard
                            qr={`data:image/png;base64,${referrals?.data.qr ?? ''}`}
                            referralsValue={referrals?.data.referrals || 0}
                            referralUrl={referrals?.data.referral_url || ''}
                        />
                        <BalanceCard
                            data={balanceData}
                            setSelectedPeriod={setSelectedPeriod}
                        />
                        <BannerCard className="hidden lg:flex" />
                    </div>

                    <div className="flex flex-col grow gap-[12px]">
                        <NotificationsCard notifications={notifications?.data || []} />
                        <ActivityCard />
                        <BannerCard className="lg:hidden pb-[4px]" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
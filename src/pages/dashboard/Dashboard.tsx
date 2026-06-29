import React, { useMemo } from 'react'
import DashboardHeading from './ui/DashboardHeading'
import SubscriptionCard from './ui/SubscriptionCard'
import BalanceCard from './ui/BalanceCard'
import type { BalanceAnalyticsObject } from '../../types/BalanceAnalyticsObject'
import NotificationsCard from './ui/NotificationsCard'
import ActivityCard from './ui/ActivityCard'
import ReferralCard from './ui/ReferralCard'
import { useGetReferralsQuery } from '../../redux/services/referralService'
import { useAppSelector } from '../../hooks/useAppDispatch'
import { useGetDobropostOrdersQuery } from '../../redux/services/dobropostOrders'
import { useDeleteAllNotificationsMutation, useGetNotificationsQuery } from '../../redux/services/notificationsService'
import { useGetBalanceQuery } from '../../redux/services/balanceService'
import { useGetDeliveryOrdersQuery } from '../../redux/services/deliveryService'
import { useGetProfileQuery, useGetReceiptCodeQuery } from '../../redux/services/userService'
import { useGetSubscriptionStatusQuery, usePaySubscriptionMutation } from '../../redux/services/subscriptionService'
import Popup from '../../ui/popup/Popup'
import { SubscriptionIcon } from '../../ui/icons/SubscriptionIcon'
import SuccessIcon from '../../ui/icons/SuccessIcon'
import ErrorIcon from '../../ui/icons/ErrorIcon'
import { useAuth } from '../../hooks/useAuth'
import WarehouseScheduleCard from './ui/WarehouseScheduleCard'
import ReceiptCodeCard from './ui/ReceiptCodeCard'
import PaymentsSummaryCard from './ui/PaymentsSummaryCard'

const SHOW_BALANCE_ANALYTICS = false

const Dashboard: React.FC = () => {
    const [justRegistered, setJustRegistered] = React.useState<boolean>(
        !!localStorage.getItem('justRegistered')
    )
    const { user } = useAuth()

    const isAuthenticated = useAppSelector((state) => state?.auth.isAuthenticated)
    const accessToken = useAppSelector((state) => state?.auth.accessToken)

    const [notificationSearch, setNotificationSearch] = React.useState<string>('')
    const [isDeleteAllNotificationsProcessing, setIsDeleteAllNotificationsProcessing] = React.useState<boolean>(false)

    const [deleteNotificationsFetch, { isLoading: isDeleteNotificationsProcessing }] = useDeleteAllNotificationsMutation()

    const [error, setError] = React.useState({ title: '', description: '' })

    const [selectedPeriod, setSelectedPeriod] = React.useState<{
        start: Date | null
        end: Date | null
    }>({
        start: null,
        end: null,
    })
    const [isSelectSubscriptionPay, setSelectSubscriptionPay] = React.useState<boolean>(false)
    const [isLinkCopied, setIsLinkCopied] = React.useState<boolean>(false)

    const formatDate = (date: Date | null): string | undefined => {
        if (!date) return undefined
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const startDateStr = formatDate(selectedPeriod.start)
    const endDateStr = formatDate(selectedPeriod.end)

    const { data: balanceResponse, refetch: balanceRefetch } = useGetBalanceQuery(
        {
            start_date: startDateStr,
            end_date: endDateStr
        },
        {
            skip: !SHOW_BALANCE_ANALYTICS || !isAuthenticated || !accessToken,
        }
    )

    const { data: profile, refetch: refetchProfile } = useGetProfileQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })

    const { data: receiptCode } = useGetReceiptCodeQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })

    const [paySubscription, { isLoading: isSubscriptionPayPending }] = usePaySubscriptionMutation()

    const { data: subscriptionStatus } = useGetSubscriptionStatusQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })

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

    async function handlePaySubscription() {
        try {
            await paySubscription().unwrap()
        } catch (err) {
            setError({ title: 'Произошла ошибка', description: 'Ошибка при оплате подписки. Попробуйте еще раз.' })
            console.log(err)
        } finally {
            refetchProfile()
            balanceRefetch()
            setSelectSubscriptionPay(false)
        }
    }

    const handleCloseRegisteredPopup = () => {
        localStorage.removeItem('justRegistered')
        setJustRegistered(false)
    }

    async function handleDeleteNotifications(notifications?: { id: string, type: 'dobropost' | 'dobropost_bx' | 'delivery' }[]) {
        try {
            if (!notifications?.length) {
                setIsDeleteAllNotificationsProcessing(true)
            }

            await deleteNotificationsFetch({ notifications }).unwrap()
        } catch (error: any) {
            console.log(error)
            setError({ title: 'Ошибка', description: 'Во время удаления произошла ошибка. Повторите попытку позже' })
        } finally {
            setIsDeleteAllNotificationsProcessing(false)
        }
    }

    return (
        <>
            {error.title && (
                <Popup
                    icon={<ErrorIcon />}
                    title={error.title}
                    description={error.description}
                    buttonText='Хорошо'
                    buttonHandler={() => setError({ title: '', description: '' })}
                    closeHandler={() => setError({ title: '', description: '' })}
                    popupClassname='lg:w-[480px]'
                />
            )}

            {
                justRegistered && (
                    <Popup
                        icon={<SuccessIcon />}
                        title='Успешная регистрация'
                        description='Вы успешно зарегистрировались в системе, теперь вам доступны все функции.'
                        buttonText='Хорошо'
                        buttonHandler={handleCloseRegisteredPopup}
                        closeHandler={handleCloseRegisteredPopup}
                        popupClassname='lg:w-[480px]'
                    />
                )
            }

            {
                isSelectSubscriptionPay && (
                    <Popup icon={<SubscriptionIcon />} title={subscriptionStatus?.data ? 'Продление подписки' : 'Подписка кончилась!'} description={subscriptionStatus?.data ? 'Продлите вашу подписку, чтобы продолжить пользоваться всеми функциями сервиса.' : 'Доступ к функциям Китайщины ограничен, оплатиите подписку для возобновления работы сервиса.'} buttonDisabled={isSubscriptionPayPending} buttonText={isSubscriptionPayPending ? 'Ожидание' : `Оплатить ${user?.subscribe_price} ₽`} buttonHandler={() => handlePaySubscription()} popupClassname='lg:w-[525px]' closeHandler={() => setSelectSubscriptionPay(false)} />
                )
            }

            {
                isLinkCopied && (
                    <Popup
                        icon={<SuccessIcon />}
                        title='Ссылка скопирована!'
                        description='Реферальная ссылка успешно скопирована в буфер обмена.'
                        buttonText='Хорошо'
                        buttonHandler={() => setIsLinkCopied(false)}
                        closeHandler={() => setIsLinkCopied(false)}
                        popupClassname='lg:w-[480px]'
                    />
                )
            }

            <div className="flex min-h-screen overflow-hidden w-full">
                <div className="flex flex-col pt-[24px] pr-[16px] pl-[16px] lg:pl-0 lg:pt-[23px] lg:pr-[24px] w-full overflow-hidden">
                    <DashboardHeading
                        dobropostData={dobropostOrders?.data?.dobropost || []}
                        deliveryData={deliveryOrders?.data?.delivery || []}
                    />

                    <div className="flex flex-col lg:flex-row lg:mt-[25px] lg:ml-[24px] lg:gap-[12px] mt-[16px] gap-[16px]">
                        <div className="flex flex-col lg:w-[49.455%] lg:shrink-0 lg:gap-[12px] lg:pb-[71px] gap-[16px]">
                            <PaymentsSummaryCard profile={profile?.data} />
                            <SubscriptionCard profile={profile?.data} subscriptionActive={subscriptionStatus?.data || false} payHandler={() => setSelectSubscriptionPay(true)} />
                            <ReferralCard
                                qr={`data:image/png;base64,${referrals?.data.qr ?? ''}`}
                                referralsValue={referrals?.data.referrals || 0}
                                referralUrl={referrals?.data.referral_url || ''}
                                handleCopyLink={() => {
                                    navigator.clipboard.writeText(referrals?.data.referral_url || '')
                                    setIsLinkCopied(true)
                                }}
                                referralsSum={referrals?.data.sum || 0}
                            />
                            {SHOW_BALANCE_ANALYTICS ? (
                                <BalanceCard
                                    data={balanceData}
                                    setSelectedPeriod={setSelectedPeriod}
                                />
                            ) : (
                                <WarehouseScheduleCard />
                            )}
                            <ReceiptCodeCard
                                code={receiptCode?.data.code}
                                qr={receiptCode?.data.qr}
                                className="hidden lg:flex"
                            />
                        </div>

                        <div className="flex flex-col grow gap-[12px]">
                            <NotificationsCard
                                notifications={notifications?.data || []}
                                searchValue={notificationSearch}
                                onSearchChange={setNotificationSearch}
                                handleDeleteNotifications={handleDeleteNotifications}
                                isDeleteNotificationsProcessing={isDeleteNotificationsProcessing}
                                isDeleteAllNotificationsProcessing={isDeleteAllNotificationsProcessing}
                            />
                            <ActivityCard />
                            <ReceiptCodeCard
                                code={receiptCode?.data.code}
                                qr={receiptCode?.data.qr}
                                className="lg:hidden mb-[4px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard

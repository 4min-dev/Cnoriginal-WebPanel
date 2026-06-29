import React, { useState } from 'react'
import OrdersNavbar from './ui/OrdersNavbar'
import OrdersHeading from './ui/OrdersHeading'
import OrderList from './ui/OrderList'
import NewOrderPopup from './ui/NewOrderPopup'
import { useGetDobropostOrdersQuery, useNewDrobropostOrderMutation, usePayDobropostOrderMutation } from '../../redux/services/dobropostOrders'
import { useGetUserClientsQuery } from '../../redux/services/clientService'
import { useAppSelector } from '../../hooks/useAppDispatch'
import { useUploadOrderFileMutation, useUploadOrderImageMutation } from '../../redux/services/uploadService'
import type { NewOrder } from '../../types/NewOrder'
import SuccessIcon from '../../ui/icons/SuccessIcon'
import Popup from '../../ui/popup/Popup'
import { usePayDeliveryOrderMutation } from '../../redux/services/deliveryService'
import ErrorIcon from '../../ui/icons/ErrorIcon'
import SelectedOrderPopup from './ui/SelectedOrderPopup'
import type { Order } from '../../types/Order'
import { usePayAllOrdersMutation } from '../../redux/services/payAllOrdersService'
import { useLazyGetUrlOrdersSheetQuery } from '../../redux/services/sheetsService'
import ItemsInOrderPopup from './ui/ItemsInOrderPopup'
import type { OrderFile } from '../../types/OrderFile'
import { useChangeStatusMutation } from '../../redux/services/changeOrderStatus'
import { useGetProfileQuery } from '../../redux/services/userService'
import { useGetSubscriptionStatusQuery } from '../../redux/services/subscriptionService'

const Orders: React.FC = () => {
    const isAuthenticated = useAppSelector((state) => state?.auth.isAuthenticated)
    const accessToken = useAppSelector((state) => state?.auth.accessToken)

    const dobropostStatuses = new Set([
        'new',
        'error',
        'data_send',
        'china_storage',
        'shipped_to_russia',
        'pvz',
        'pickup',
        'outwardly',
        'send_to_russia',
        'collected',
        'export',
        'destruction',
        'won'
    ])

    const [relativeOrder, setRelativeOrder] = useState<NewOrder | null>(null)
    const [isManyOrdersCreating, setIsManyOrdersCreating] = useState<boolean>(false)

    const [error, setError] = React.useState({ title: '', description: '' })
    const [success, setSuccess] = React.useState<{ title: string, description: string }>({ title: '', description: '' })

    const [isItemsInOrderPopup, setIsItemsInOrderPopup] = useState<boolean>(false)

    const [searchQuery, setSearchQuery] = useState<string>('')
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [newOrderPopup, setNewOrderPopup] = useState<boolean>(false)

    const [selectedOrdersToPay, setSelectedOrdersToPay] = useState<Order[]>([])
    const [selectedDeliveryOrdersToPay, setSelectedDeliveryOrdersToPay] = useState<Order[]>([])
    const [selectedPvzOrdersToPay, setSelectedPvzOrdersToPay] = useState<Order[]>([])
    const [handleFetchToPayPvzOrders, { isLoading: isPvzPaying }] = useChangeStatusMutation()

    const { data: dobropostOrders, refetch: refetchDobropostOrders } = useGetDobropostOrdersQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })

    const { data: profile } = useGetProfileQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })

    const { data: subscriptionStatus } = useGetSubscriptionStatusQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })

    const isSubscriptionActive = subscriptionStatus?.data === true

    const hasRequiredPassportData = Boolean(
        profile?.data?.passport_series &&
        profile?.data?.passport_number &&
        profile?.data?.passport_issue_date
    )

    const { data: userClients } = useGetUserClientsQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })

    const [getOrdersSheet, { isFetching: isDownloadingSheet }] = useLazyGetUrlOrdersSheetQuery()

    const [fetchToPayAllOrders, { isLoading: isAllOrdersPaying }] = usePayAllOrdersMutation()

    const [handleDeliveryOrderPay, { isLoading: isDeliveryPayProcessing }] = usePayDeliveryOrderMutation()
    const [handleDobropostOrderPay, { isLoading: isDobropostPayProcessing }] = usePayDobropostOrderMutation()

    const [uploadOrderFile, { data: uploadedOrderFile }] = useUploadOrderFileMutation()
    const [uploadOrderImage] = useUploadOrderImageMutation()
    const [createOrder] = useNewDrobropostOrderMutation()

    function handleSetActiveNewOrderPopup() {
        if (!isSubscriptionActive) {
            setError({
                title: 'Подписка закончилась',
                description: 'Оформите подписку, чтобы создавать новые заказы.'
            })
            return
        }

        if (!hasRequiredPassportData) {
            setError({
                title: 'Заполните паспортные данные',
                description: 'Для создания заказа нужны серия, номер и дата выдачи паспорта.'
            })
            return
        }

        setNewOrderPopup(!newOrderPopup)
    }

    async function handleCreateOrder(order: NewOrder & { tables?: File[], imageFile?: File }) {
        if (!isSubscriptionActive) {
            setError({
                title: 'Подписка закончилась',
                description: 'Оформите подписку, чтобы создавать новые заказы.'
            })
            return
        }

        try {
            let isUploadedFile: boolean = false

            if (order.imageFile) {
                const formData = new FormData()
                formData.append('file', order.imageFile)
                const response = await uploadOrderImage(formData).unwrap()
                order.image_url = response.data.url
            }

            if (order.tables && order.tables.length > 0) {
                const formData = new FormData()
                formData.append('file', order.tables[0])
                await uploadOrderFile(formData).unwrap()
                isUploadedFile = true
            }

            setIsItemsInOrderPopup(isUploadedFile)

            if (!isUploadedFile) { await createOrder(order).unwrap() }
            else { setRelativeOrder(order) }
        } catch (error) {
            console.error('Ошибка при создании заказа:', error)
            throw error
        }
    }

    function copyTrackNumber(trackNumber: string) {
        navigator.clipboard.writeText(trackNumber)
            .then(() => {
                setSuccess({ title: 'Трек номер скопирован!', description: 'Трек номер успешно скопирован в буфер обмена.' })
            })
            .catch((err) => console.error('Ошибка при копировании:', err))
    }

    async function handlePayOrder() {
        if (!selectedOrder) return

        try {
            if (dobropostStatuses.has(selectedOrder.actual_bx_status)) {
                await handleDobropostOrderPay(selectedOrder.id).unwrap()
            } else {
                await handleDeliveryOrderPay(selectedOrder.id).unwrap()
            }

            setSuccess({ title: 'Заказ оплачен!', description: 'Заказ был успешно оплачен, средства списаны с баланса.' })
        } catch (err: any) {
            const detail = err?.detail
            if (detail?.error === 'ERROR_ORDER_PAYMENT_BALANCE_INSUFFICIENT') {
                setError({ title: 'Неверный код', description: 'Недостаточно средств. Пополните баланс и попробуйте снова.' })
            } else {
                setError({ title: 'Ошибка оплаты', description: 'Не удалось оплатить. Попробуйте позже' })
            }
        } finally {
            setSelectedOrder(null)
        }
    }

    async function handlePayAll() {
        try {
            let ordersList: { id: string; error?: string }[] = []
            const deliveriesList: { id: string; error?: string }[] = []
            console.log('selectedDeliveryOrdersToPay', selectedDeliveryOrdersToPay)
            const ordersToPay = selectedOrdersToPay.filter(order => !order.paid)
            const deliveriesToPay = selectedDeliveryOrdersToPay.filter(order => !order.paid)
            const pvzToPay = selectedPvzOrdersToPay.filter(order => !order.paid)

            if (ordersToPay.length === 0 && deliveriesToPay.length === 0 && pvzToPay.length === 0) {
                setError({
                    title: 'Нет заказов к оплате',
                    description: 'Все выбранные заказы уже оплачены или не готовы к оплате.'
                })
                return
            }

            if (ordersToPay.length > 0 || pvzToPay.length > 0 || deliveriesToPay.length > 0) {
                const orders = [
                    ...ordersToPay.map(order => order.id),
                    ...pvzToPay.map(order => order.id),
                    ...deliveriesToPay.map(order => order.id)
                ]

                const ordersRes = await fetchToPayAllOrders({ orders }).unwrap()

                console.log('Orders payment response:', ordersRes)

                ordersList = ordersRes.data?.list || []
            }

            const allResults = [...ordersList, ...deliveriesList]
            const successCount = allResults.filter(item => !item.error).length
            const errorCount = allResults.filter(item => item.error).length
            console.log('allResults', allResults)
            if (successCount > 0) {
                setSuccess({
                    title: 'Оплата завершена',
                    description: `Успешно оплачено: ${successCount}, с ошибкой: ${errorCount}`
                })
            } else if (errorCount > 0) {
                setError({
                    title: 'Ошибка оплаты',
                    description: `Не удалось оплатить ни один заказ. Ошибок: ${errorCount}`
                })
            }

        } catch (error) {
            console.error('Payment error:', error)

            setError({
                title: 'Ошибка оплаты',
                description: 'Не удалось выполнить оплату. Попробуйте позже.'
            })
        } finally {
            refetchDobropostOrders()
        }
    }

    async function handleDownloadOrdersTable() {
        try {
            const result = await getOrdersSheet(undefined, true).unwrap()

            const sheetUrl = result.data
            const fileUrl = `${sheetUrl}/export?format=xlsx`

            const link = document.createElement('a')
            link.href = fileUrl
            link.download = 'orders.xlsx'
            document.body.appendChild(link)
            link.click()
            link.remove()

        } catch (error) {
            console.error(error)
        }
    }

    async function handleCreateManyOrders(localOrders: OrderFile[]) {
        if (!isSubscriptionActive) {
            setError({
                title: 'Подписка закончилась',
                description: 'Оформите подписку, чтобы создавать новые заказы.'
            })
            return
        }

        let errCount = 0
        let successCount = 0

        setIsManyOrdersCreating(true)

        const ordersToCreate = localOrders as unknown as { order: NewOrder }[]

        for (const order of ordersToCreate) {
            try {
                const res = await createOrder(order.order).unwrap()
                console.log('res', res)
                successCount += 1
            } catch (e) {
                errCount += 1
                console.error('Ошибка создания заказа:', e)
            }
        }

        if (relativeOrder) {
            try {
                await createOrder(relativeOrder).unwrap()
                successCount += 1
            } catch (e) {
                errCount += 1
                console.error('Ошибка relativeOrder:', e)
            }
        }

        setRelativeOrder(null)
        setIsItemsInOrderPopup(false)
        setIsManyOrdersCreating(false)

        if (successCount && !errCount) {
            setSuccess({
                title: 'Заказы созданы',
                description: `Успешно создано ${successCount} заказов`
            })
        } else if (!successCount && errCount) {
            setError({
                title: 'Заказы не были созданы',
                description: `Не было создано ${errCount} заказов`
            })
        } else if (successCount && errCount) {
            setSuccess({
                title: 'Заказы созданы частично',
                description: `Успешно создано ${successCount}. Не было создано ${errCount} заказов`
            })
        }
    }

    function handleSelectCardToPay(order: Order) {
        const isDelivery = order.actual_bx_status === 'shipped_to_russia'
        const isPvz = order.actual_bx_status === 'pvz' || order.actual_bx_status === 'pickup'

        if (isDelivery) {
            setSelectedDeliveryOrdersToPay(prev => {
                const exists = prev.some(item => item.id === order.id)

                return exists
                    ? prev.filter(item => item.id !== order.id)
                    : [...prev, order]
            })

        } else if (isPvz) {
            setSelectedPvzOrdersToPay(prev => {
                const exists = prev.some(item => item.id === order.id)

                return exists
                    ? prev.filter(item => item.id !== order.id)
                    : [...prev, order]
            })

        } else {
            setSelectedOrdersToPay(prev => {
                const exists = prev.some(item => item.id === order.id)

                return exists
                    ? prev.filter(item => item.id !== order.id)
                    : [...prev, order]
            })
        }
    }

    function checkIsCardSelected(order: Order) {
        let list = []
        if (order.actual_bx_status.toLowerCase() === 'shipped_to_russia') { list = selectedDeliveryOrdersToPay }
        else if (order.actual_bx_status.toLowerCase() === 'pvz' || order.actual_bx_status.toLowerCase() === 'pickup') { list = selectedPvzOrdersToPay }
        else { list = selectedOrdersToPay }
        return list.some(item => item.id === order.id)
    }

    async function handlePvzPay() {
        try {
            await handleFetchToPayPvzOrders(
                selectedPvzOrdersToPay.map(order => order.id)
            ).unwrap()
        } catch (error) {
            console.log(error)
        } finally {
            refetchDobropostOrders()
            setSelectedPvzOrdersToPay([])
        }
    }

    return (
        <div className='lg:overflow-hidden lg:max-h-[98vh]'>
            {
                isItemsInOrderPopup && (
                    <ItemsInOrderPopup onClose={() => setIsItemsInOrderPopup(false)} items={uploadedOrderFile?.data?.orders || []} handleCreateManyOrders={handleCreateManyOrders} isCreating={isManyOrdersCreating} />
                )
            }

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
                success.title && (
                    <Popup
                        icon={<SuccessIcon />}
                        title={success.title}
                        description={success.description}
                        buttonText='Хорошо'
                        buttonHandler={() => setSuccess({ title: '', description: '' })}
                        closeHandler={() => setSuccess({ title: '', description: '' })}
                        popupClassname='lg:w-[480px]'
                    />
                )
            }

            {selectedOrder && (
                <SelectedOrderPopup
                    selectedOrder={selectedOrder}
                    isPayProcessing={isDeliveryPayProcessing || isDobropostPayProcessing}
                    payHandler={handlePayOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            <div className='flex overflow-x-hidden'>
                {newOrderPopup && (
                    <NewOrderPopup
                        onClose={handleSetActiveNewOrderPopup}
                        handleCreateOrder={handleCreateOrder}
                        userClients={userClients?.data || []}
                        setError={setError}
                    />
                )}

                <div className='flex flex-col lg:pt-[24px] lg:pb-[71px] pt-[32px] grow overflow-x-hidden'>
                    <OrdersNavbar />
                    <OrdersHeading
                        handleSetActiveNewOrderPopup={handleSetActiveNewOrderPopup}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        isPayAllReady={!!selectedOrdersToPay.length || !!selectedDeliveryOrdersToPay.length || !!selectedPvzOrdersToPay.length}
                        handlePayAll={handlePayAll}
                        isPayProcessing={isAllOrdersPaying}
                        handleDownloadOrdersTable={handleDownloadOrdersTable}
                        isDownloadProcessing={isDownloadingSheet}
                        isPayPvzProcessing={selectedPvzOrdersToPay.length == 0 || isPvzPaying}
                        handlePvzPay={handlePvzPay}
                        canCreateOrder={hasRequiredPassportData && isSubscriptionActive}
                    />
                    <OrderList
                        copyTrackNumber={copyTrackNumber}
                        dobropostOrders={dobropostOrders?.data?.dobropost || []}
                        searchQuery={searchQuery}
                        handleSetActiveNewOrderPopup={handleSetActiveNewOrderPopup}
                        handleCardClick={(order: Order) => setSelectedOrder(order)}
                        handleSelectCardToPay={handleSelectCardToPay}
                        checkIsCardSelected={checkIsCardSelected}
                        canCreateOrder={hasRequiredPassportData && isSubscriptionActive}
                    />
                </div>
            </div>
        </div>
    )
}

export default Orders

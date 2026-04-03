import React, { useState } from 'react'
import OrdersNavbar from './ui/OrdersNavbar'
import OrdersHeading from './ui/OrdersHeading'
import OrderList from './ui/OrderList'
import MobileHeader from './ui/MobileHeader'
import NewOrderPopup from './ui/NewOrderPopup'
import { useGetDobropostOrdersQuery, useNewDrobropostOrderMutation } from '../../redux/services/dobropostOrders'
import { useGetUserClientsQuery } from '../../redux/services/clientService'
import { useAppSelector } from '../../hooks/useAppDispatch'
import { useUploadOrderFileMutation, useUploadOrderImageMutation } from '../../redux/services/uploadService'
import type { NewOrder } from '../../types/NewOrder'
import SuccessIcon from '../../ui/icons/SuccessIcon'
import Popup from '../../ui/popup/Popup'
import { useGetDeliveryOrdersQuery } from '../../redux/services/deliveryService'
import ErrorIcon from '../../ui/icons/ErrorIcon'

const Orders: React.FC = () => {
    const isAuthenticated = useAppSelector((state) => state?.auth.isAuthenticated)
    const accessToken = useAppSelector((state) => state?.auth.accessToken)

    const [createOrderError, setCreateOrderError] = useState<{ title: string, description: string }>({ title: '', description: '' })

    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isTrackCopied, setIsTrackCopied] = useState<boolean>(false)

    const { data: deliveryOrders } = useGetDeliveryOrdersQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })
    const { data: dobropostOrders } = useGetDobropostOrdersQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })
    const { data: userClients } = useGetUserClientsQuery(undefined, {
        skip: !isAuthenticated || !accessToken,
    })
    const [uploadOrderFile] = useUploadOrderFileMutation()
    const [uploadOrderImage] = useUploadOrderImageMutation()
    const [createOrder] = useNewDrobropostOrderMutation()
    const [newOrderPopup, setNewOrderPopup] = useState<boolean>(false)

    function handleSetActiveNewOrderPopup() {
        setNewOrderPopup(!newOrderPopup)
    }

    async function handleCreateOrder(order: NewOrder & { tables: File[], imageFile?: File }) {
        try {
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
            }

            await createOrder(order).unwrap()

        } catch (error) {
            console.error('Ошибка при создании заказа:', error)
            throw error
        }
    }

    function copyTrackNumber(trackNumber: string) {
        navigator.clipboard.writeText(trackNumber)
            .then(() => {
                setIsTrackCopied(true)
            })
            .catch((err) => {
                console.error('Ошибка при копировании трек-номера:', err)
            })
    }

    return (
        <>
            {
                isTrackCopied && (
                    <Popup
                        icon={<SuccessIcon />}
                        title='Ссылка скопирована!'
                        description='Реферальная ссылка успешно скопирована в буфер обмена.'
                        buttonText='Хорошо'
                        buttonHandler={() => setIsTrackCopied(false)}
                        closeHandler={() => setIsTrackCopied(false)}
                        popupClassname='lg:w-[480px]'
                    />
                )
            }

            {
                createOrderError.title && (
                    <Popup
                        icon={<ErrorIcon />}
                        title={createOrderError.title}
                        description={createOrderError.description}
                        buttonText='Хорошо'
                        buttonHandler={() => setCreateOrderError({ title: '', description: '' })}
                        closeHandler={() => setCreateOrderError({ title: '', description: '' })}
                        popupClassname='lg:w-[480px]'
                    />
                )
            }

            <div className='flex overflow-x-hidden'>
                {
                    newOrderPopup && <NewOrderPopup onClose={handleSetActiveNewOrderPopup} handleCreateOrder={handleCreateOrder} userClients={userClients?.data || []} setError={setCreateOrderError} />
                }
                <div className='flex flex-col lg:pt-[24px] lg:pb-[71px] pt-[50px] grow overflow-x-hidden'>
                    <MobileHeader className='pl-[16px] pr-[16px] lg:pl-0 lg:pr-0' />
                    <OrdersNavbar />
                    <OrdersHeading handleSetActiveNewOrderPopup={handleSetActiveNewOrderPopup} searchQuery={searchQuery}
                        onSearchChange={setSearchQuery} />
                    <OrderList copyTrackNumber={copyTrackNumber} dobropostOrders={dobropostOrders?.data.dobropost || []} deliveryOrders={deliveryOrders?.data.delivery || []} searchQuery={searchQuery} handleSetActiveNewOrderPopup={handleSetActiveNewOrderPopup} />
                </div>
            </div>
        </>
    )
}

export default Orders

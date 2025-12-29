import React from 'react'
import AsidePanel from '../../ui/aside/AsidePanel'
import OrdersNavbar from './ui/OrdersNavbar'
import OrdersHeading from './ui/OrdersHeading'
import OrderList from './ui/OrderList'

const Orders: React.FC = () => {
    return (
        <div className='flex'>
            <AsidePanel />
            <div className='flex flex-col pt-[24px] pb-[71px] grow overflow-x-hidden'>
                <OrdersNavbar />
                <OrdersHeading />
                <OrderList />
            </div>
        </div>
    )
}

export default Orders

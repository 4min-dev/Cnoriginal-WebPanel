import React from 'react'
import AsidePanel from '../../ui/aside/AsidePanel'
import OrdersNavbar from './ui/OrdersNavbar'
import OrdersHeading from './ui/OrdersHeading'
import OrderList from './ui/OrderList'
import MobileHeader from './ui/MobileHeader'

const Orders: React.FC = () => {
    return (
        <div className='flex'>
            <AsidePanel />
            <div className='flex flex-col lg:pt-[24px] lg:pb-[71px] pt-[50px] grow overflow-x-hidden'>
                <MobileHeader className='pl-[16px] pr-[16px] lg:pl-0 lg:pr-0' />
                <OrdersNavbar />
                <OrdersHeading />
                <OrderList />
            </div>
        </div>
    )
}

export default Orders

import React from 'react'
import AsidePanel from '../../ui/aside/AsidePanel'
import MobileHeader from '../orders/ui/MobileHeader'
import DeliveryNavbar from './ui/DeliveryNavbar'
import DeliveryHeading from './ui/DeliveryHeading'
import DeliveryFilters from './ui/DeliveryFilters'
import DeliveryTable from './ui/DeliveryTable'

const Delivery: React.FC = () => {
    return (
        <div className='flex'>
            <AsidePanel />
            <div className='flex flex-col lg:pt-[24px] lg:pb-[71px] pt-[50px] grow overflow-x-hidden'>
                <MobileHeader className='pl-[16px] pr-[16px] lg:pl-0 lg:pr-0' />
                <DeliveryNavbar />
                <DeliveryHeading />
                <DeliveryFilters />
                <DeliveryTable />
            </div>
        </div>
    )
}

export default Delivery

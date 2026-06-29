import { useContext } from 'react'
import PaymentContext from '../context/PaymentContext'

type PaymentContextType = {
    isPaymentPopupOpen: boolean,
    openPaymentPopup: () => void,
    closePaymentPopup: () => void
}

export const usePayment = (): PaymentContextType => {
    const context = useContext(PaymentContext)
    if (!context) {
        throw new Error('usePayment must be used within a PaymentProvider')
    }
    return context as any
}
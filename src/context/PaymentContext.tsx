import React, { createContext, useState, useCallback, type ReactNode, useEffect } from 'react'
import PaymentPopup from '../ui/PaymentPopup'
import { useCreatePaymentMutation, useCheckPaymentStatusMutation } from '../redux/services/paymentService'
import SuccessIcon from '../ui/icons/SuccessIcon'
import ErrorIcon from '../ui/icons/ErrorIcon'
import WaitingIcon from '../ui/icons/WaitingIcon'
import Popup from '../ui/popup/Popup'
import Button from '../ui/buttons/Button'

type PaymentStep = 'input' | 'waiting' | 'success' | 'error'

type PaymentContextType = {
    isOpen: boolean,
    step: PaymentStep,
    error: { title: string; description: string } | null,
    isLoading: boolean,
    sum: string,
    openPaymentPopup: () => void,
    closePaymentPopup: () => void,
    createPayment: (amount: string) => Promise<void>,
    checkPaymentStatus: (paymentId: number) => Promise<void>
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<PaymentStep>('input')
    const [error, setError] = useState<{ title: string; description: string } | null>(null)
    const [sum, setSum] = useState<string>('')
    const [paymentId, setPaymentId] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const [createPaymentMutation] = useCreatePaymentMutation()
    const [checkPaymentStatusMutation] = useCheckPaymentStatusMutation()

    useEffect(() => {
        let interval: any = null

        if (step === 'waiting' && paymentId) {
            interval = setInterval(() => {
                checkPaymentStatusMutation(paymentId)
                    .unwrap()
                    .then((result) => {
                        const status = result.data.status
                        if (status === 'success') {
                            setStep('success')
                            if (interval) clearInterval(interval)
                        } else if (status === 'fail') {
                            setError({ title: 'Платёж не прошёл', description: 'К сожалению, платёж не был успешным.' })
                            setStep('error')
                            if (interval) clearInterval(interval)
                        }
                    })
                    .catch(() => {
                        setError({ title: 'Ошибка проверки статуса', description: 'Не удалось проверить статус платежа. Попробуйте снова.' })
                        setStep('error')
                        if (interval) clearInterval(interval)
                    })
            }, 4000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [step, paymentId, checkPaymentStatusMutation])

    const openPaymentPopup = useCallback(() => {
        setStep('input')
        setError(null)
        setSum('')
        setPaymentId(null)
        setIsOpen(true)
    }, [])

    const closePaymentPopup = useCallback(() => {
        setIsOpen(false)
        setStep('input')
        setError(null)
        setPaymentId(null)
        setSum('')
    }, [])

    const createPayment = useCallback(async (amount: string) => {
        const parsedAmount = Number(amount)
        if (!amount.trim() || parsedAmount <= 0) return

        setIsLoading(true)
        setError(null)

        try {
            const result = await createPaymentMutation({ amount: parsedAmount }).unwrap()
            const data = result.data

            setPaymentId(data.payment_id)
            setSum(amount)

            if (data.payment_link) {
                window.open(data.payment_link, '_blank')
            }

            setStep('waiting')
        } catch (err: any) {
            const message = err?.data?.detail || 'Не удалось создать платёж'
            setError({ title: 'Ошибка создания платежа', description: message })
            setStep('error')
        } finally {
            setIsLoading(false)
        }
    }, [createPaymentMutation])

    const checkPaymentStatus = useCallback(async (id: number) => {
        setIsLoading(true)
        try {
            const result = await checkPaymentStatusMutation(id).unwrap()
            const status = result.data.status

            if (status === 'success') {
                setStep('success')
            } else if (status === 'fail') {
                setError({ title: 'Платёж не прошёл', description: 'К сожалению, платёж не был успешным. Попробуйте снова.' })
                setStep('error')
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [checkPaymentStatusMutation])

    return (
        <PaymentContext.Provider value={{
            isOpen,
            step,
            error,
            isLoading,
            sum,
            openPaymentPopup,
            closePaymentPopup,
            createPayment,
            checkPaymentStatus,
        }}>
            {children}

            <PaymentPopup
                isOpen={isOpen && step === 'input'}
                closeHandler={closePaymentPopup}
                onCreatePayment={createPayment}
                isPayProcessing={isLoading}
                sum={sum}
                handleSumChange={setSum}
            />

            {isOpen && step === 'waiting' && (
                <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/60 z-[999] flex items-center justify-center" onClick={closePaymentPopup}>
                    <div
                        className="p-[28px] border border-[#F3F3F3] rounded-[20px] shadow-[0px_0px_25.8px_0px_#0F0F2B0D] mr-[16px] ml-[16px] relative bg-white flex flex-col items-center w-full max-w-[523px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type='button'
                            className='absolute top-[20px] right-[20px]'
                            onClick={closePaymentPopup}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M7 7L17 17M7 17L17 7" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <WaitingIcon />

                        <div className="flex flex-col items-center gap-3 mt-6 text-center">
                            <span className="font-bold text-[28px] text-[#33331F]">Платёж в обработке</span>
                            <span className="text-[18px] text-[#B9B9B9]">
                                Ожидайте поступления <span className="text-[#ED0028] font-medium">{sum} ₽</span><br />
                                на счёт в течение 30 минут.
                            </span>
                        </div>

                        <div className="flex gap-3 mt-8 w-full">
                            <Button
                                className="flex-1 h-[44px]"
                                buttonText="Проверить статус"
                                clickHandler={() => paymentId && checkPaymentStatus(paymentId)}
                                disabled={isLoading}
                            />
                            <Button
                                className="flex-1 h-[44px]"
                                buttonText="Закрыть"
                                clickHandler={closePaymentPopup}
                            />
                        </div>
                    </div>
                </div>
            )}

            {isOpen && step === 'success' && (
                <Popup
                    icon={<SuccessIcon />}
                    title="Оплата прошла успешно"
                    description={`На ваш баланс зачислено ${sum} ₽`}
                    buttonText="Хорошо"
                    buttonHandler={closePaymentPopup}
                    closeHandler={closePaymentPopup}
                />
            )}

            {isOpen && step === 'error' && error && (
                <Popup
                    icon={<ErrorIcon />}
                    title={error.title}
                    description={error.description}
                    buttonText="Хорошо"
                    buttonHandler={closePaymentPopup}
                    closeHandler={closePaymentPopup}
                />
            )}
        </PaymentContext.Provider>
    )
}

export default PaymentContext
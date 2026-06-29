import React from 'react'
import Popup from '../../ui/popup/Popup'
import { useSendVerifyCodeMutation, useVerifyCodeMutation } from '../../redux/services/authService'
import ErrorIcon from '../../ui/icons/ErrorIcon'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../redux/slices/authSlice'
import Button from '../../ui/buttons/Button'
import TelInput from '../../ui/inputs/TelInput'

const Authorization: React.FC = () => {
    const dispatch = useDispatch()
    const [error, setError] = React.useState({ title: '', description: '' })
    const [handleVerifyCode, { isLoading: isVerifyCodeProcessing }] = useVerifyCodeMutation()
    const [handleSendVerifyCode, { isLoading: isVerifyCodeSending }] = useSendVerifyCodeMutation()

    const [currentStep, setCurrentStep] = React.useState<number>(1)
    const [codeValue, setCodeValue] = React.useState<string>('')
    const [phone, setPhone] = React.useState<string>('')

    const isStepValid = React.useMemo(() => {
        if (currentStep === 1) {
            return phone.trim().length == 16 && !isVerifyCodeSending
        }

        if (currentStep === 2) {
            return codeValue.length == 6 && !isVerifyCodeProcessing
        }

        return false
    }, [currentStep, phone, codeValue, isVerifyCodeSending, isVerifyCodeProcessing])

    const isPhoneValid = React.useMemo(() => {
        const digits = phone.replace(/\D/g, '')

        return digits.length === 11
    }, [phone])

    function handleNext() {
        if (currentStep < 2) {
            setCurrentStep(prev => prev + 1)
        }
    }

    function handlePrev() {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
        } else {
            window.location.href = ''
        }
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let value = e.target.value.replace(/\D/g, '')

        if (value.length === 0) {
            setPhone('')
            return
        }

        if (value.startsWith('7') || value.startsWith('8')) {
            value = value.slice(1)
        }

        let formatted = '+7'

        if (value.length > 0) formatted += '(' + value.slice(0, 3)
        if (value.length > 3) formatted += ')' + value.slice(3, 6)
        if (value.length > 6) formatted += '-' + value.slice(6, 8)
        if (value.length > 8) formatted += '-' + value.slice(8, 10)

        if (formatted.length > 16) {
            formatted = formatted.slice(0, 16)
        }

        setPhone(formatted)
    }

    function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCodeValue(e.target.value)
    }

    const cleanPhone = phone.replace(/\D/g, '')
    const formattedPhone = '+' + cleanPhone

    async function handleGetLoginCode(isTgAuth: boolean) {
        try {
            await handleSendVerifyCode({
                phone: formattedPhone,
                auth: true,
                tg: isTgAuth
            }).unwrap()

            handleNext()
        } catch (err: any) {
            const detail = err?.detail

            if (detail?.error === 'ERROR_AUTH_EXCEDED_LIMIT_SEND_CODE') {
                setError({ title: 'Превышен лимит', description: 'Вы превысили лимит отправки кодов. Попробуйте через 30 минут' })
            } else if (detail?.error === 'ERROR_AUTH_USER_CODE_BAN') {
                setError({ title: 'Доступ заблокирован', description: 'Вы временно заблокированы на 30 минут' })
            } else {
                setError({ title: 'Не удалось отправить код', description: 'Попробуйте позже' })
            }
        }
    }

    async function handleLogin() {
        try {
            const verifyRes = await handleVerifyCode({
                phone: formattedPhone,
                code: codeValue
            }).unwrap()

            if (verifyRes?.data?.access_token && verifyRes?.data?.refresh_token) {
                dispatch(setCredentials({
                    accessToken: verifyRes.data.access_token,
                    refreshToken: verifyRes.data.refresh_token
                }))

                window.location.href = '/dashboard'
            }
        } catch (err: any) {
            const detail = err?.detail

            if (detail?.error === 'ERROR_AUTH_INCORECT_CODE') {
                setError({ title: 'Неверный код', description: 'Введённый код неверный. Попробуйте ещё раз' })
            } else if (detail?.error === 'ERROR_AUTH_EXCEED_VERIVY_CODE') {
                setError({ title: 'Превышен лимит', description: 'Слишком много неверных попыток. Попробуйте через 30 минут' })
            } else {
                setError({ title: 'Ошибка авторизации', description: 'Не удалось завершить авторизацию. Попробуйте позже' })
            }
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

            <div className='flex flex-col items-center justify-center h-screen lg:mx-0 mx-[16px]'>
                <div className='flex flex-col gap-[16px]'>
                    <div className='flex flex-col gap-[8px] lg:gap-[20px] items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='lg:w-[101px] lg:h-[52px] w-[77px] h-[40px]' width="101" height="52" viewBox="0 0 101 52" fill="none">
                            <path d="M51.043 26C51.043 11.6406 39.6166 0 25.5215 0H0C0 14.3594 11.4264 26 25.5215 26H0C0 40.3594 11.4264 52 25.5215 52C39.6166 52 51.043 40.3594 51.043 26Z" fill="#ED0028" />
                            <path d="M49.957 0H75.4785C89.5736 0 101 11.6406 101 26V52H75.4785C61.3834 52 49.957 40.3594 49.957 26V0Z" fill="#ED0028" />
                        </svg>

                        <span className='font-semibold text-[28px] lg:text-[32px] text-[#33331F]'>
                            Авторизация
                        </span>
                    </div>

                    <div className='flex gap-[8px] justify-center'>
                        <div
                            className={`flex items-center justify-center h-[32px] rounded-[1000px] px-[12px] cursor-pointer text-[14px] lg:text-[16px] ${currentStep === 1 ? 'bg-[#ED0028] text-white' : 'border border-[#F1F1F1] text-[#B9B9B9]'}`}
                            onClick={() => setCurrentStep(1)}
                        >
                            Шаг 1
                        </div>
                        <div
                            className={`flex items-center justify-center h-[32px] rounded-[1000px] px-[12px] cursor-pointer text-[14px] lg:text-[16px] ${currentStep === 2 ? 'bg-[#ED0028] text-white' : 'border border-[#F1F1F1] text-[#B9B9B9]'}`}
                            onClick={() => setCurrentStep(2)}
                        >
                            Шаг 2
                        </div>
                    </div>
                </div>

                {currentStep === 1 && (
                    <div className='flex flex-col gap-[12px] w-[324px] lg:w-[395px] mt-[32px]'>
                        <div className='flex flex-col gap-[8px] w-full'>
                            <span className='font-medium text-[14px] text-[#333333] after:content-["*"] after:text-[#ED0028] after:ml-[2px]'>
                                Телефон
                            </span>
                            <TelInput
                                value={phone}
                                onChange={handlePhoneChange}
                                className="outline-none border w-full border-[#B9B9B966] bg-none rounded-[10px] text-[#333333] text-[16px] h-[44px] px-[12px]"
                                placeholder="+7(___)___-__-__"
                            />
                        </div>

                        <Button disabled={!isPhoneValid || isVerifyCodeSending} clickHandler={() => handleGetLoginCode(true)} buttonText='Получить код через Telegram' className='w-full h-[48px] rounded-[12px] text-[16px]' />
                    </div>
                )}

                {currentStep === 2 && (
                    <div className='flex flex-col gap-[12px] w-[324px] lg:w-[395px] mt-[32px]'>
                        <div className='flex flex-col gap-[8px] w-full'>
                            <span className='font-medium text-[14px] text-[#333333] after:content-["*"] after:text-[#ED0028] after:ml-[2px]'>
                                6-значный код
                            </span>
                            <input
                                type='num'
                                value={codeValue}
                                onChange={handleCodeChange}
                                className="outline-none border w-full border-[#B9B9B966] bg-none rounded-[10px] text-[#333333] text-[16px] h-[44px] px-[12px]"
                                placeholder='123456'
                                maxLength={6}
                            />
                        </div>
                    </div>
                )}

                <div className='flex w-[324px] lg:w-[395px] gap-[8px] mt-[20px] lg:mt-[24px]'>
                    {
                        currentStep > 1 && (
                            <button
                                type='button'
                                className='w-full h-[48px] rounded-[12px] bg-[#F2F2F2] font-medium text-[#333333] text-[16px] cursor-pointer'
                                onClick={handlePrev}
                            >
                                Назад
                            </button>
                        )
                    }
                    <Button disabled={!isStepValid} clickHandler={() => currentStep == 2 ? handleLogin() : handleGetLoginCode(false)} buttonText={currentStep === 2 ? 'Войти' : 'Получить код по SMS'} className='w-full h-[48px] rounded-[12px] text-[16px]' />
                </div>

                <a href='/registration' className='mt-[4px]'>
                    <span className='font-medium text-[14px] text-[#ED0028] hover:text-[#C60022] underline underline-offset-4 transition-colors'>
                        Регистрация
                    </span>
                </a>
            </div>
        </>
    )
}

export default Authorization
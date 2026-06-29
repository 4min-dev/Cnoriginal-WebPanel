import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSendVerifyCodeMutation, useSignupMutation, useVerifySignupCodeMutation } from '../../redux/services/authService'
import { setCredentials } from '../../redux/slices/authSlice'
import Popup from '../../ui/popup/Popup'
import ErrorIcon from '../../ui/icons/ErrorIcon'
import Button from '../../ui/buttons/Button'
import TelegramLoginWidget from '../../ui/TelegramLoginWidget'
import type TelegramUser from '../../types/TelegramUser'
import TelInput from '../../ui/inputs/TelInput'
import DateInput from '../../ui/inputs/DateInput'
import Checkbox from '../../ui/Checkbox'

const USERNAME_REGEXP = /^[A-Za-z]+$/
const PRIVACY_POLICY_URL = import.meta.env.VITE_PRIVACY_POLICY_URL || ''
const OFFER_URL = import.meta.env.VITE_OFFER_URL || ''
const TELEGRAM_AUTH_BOT_ID = import.meta.env.VITE_TELEGRAM_AUTH_BOT_ID ? parseInt(import.meta.env.VITE_TELEGRAM_AUTH_BOT_ID) : 0

const Registration: React.FC = () => {
    const dispatch = useDispatch()

    const [handleSendVerifyCode, { isLoading: isVerifyCodeSending }] = useSendVerifyCodeMutation()
    const [handleVerifySignupCode, { isLoading: isSignupCodeVerifying }] = useVerifySignupCodeMutation()
    const [handleSignup, { isLoading: isSignupProcessing }] = useSignupMutation()

    const [currentStep, setCurrentStep] = React.useState(1)
    const [codeValue, setCodeValue] = React.useState('')
    const [isSignupCodeVerified, setIsSignupCodeVerified] = React.useState(false)

    const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)

    const [lastName, setLastName] = React.useState('')
    const [firstName, setFirstName] = React.useState('')
    const [middleName, setMiddleName] = React.useState('')
    const [birthday, setBirthday] = React.useState('')

    const [city, setCity] = React.useState('')
    const [street, setStreet] = React.useState('')
    const [house, setHouse] = React.useState('')
    const [apartment, setApartment] = React.useState('')

    const [phone, setPhone] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [personalDataAgreement, setPersonalDataAgreement] = React.useState(false)
    const [privacyPolicyAgreement, setPrivacyPolicyAgreement] = React.useState(false)
    const [offerAgreement, setOfferAgreement] = React.useState(false)
    const [marketingConsent, setMarketingConsent] = React.useState(false)

    const [error, setError] = React.useState({ title: '', description: '' })

    const isUsernameValid = React.useMemo(() => {
        return username.length >= 5 && username.length <= 15 && USERNAME_REGEXP.test(username)
    }, [username])

    const isPhoneValid = React.useMemo(() => {
        const digits = phone.replace(/\D/g, '')
        return digits.length === 11
    }, [phone])

    const isCodeValid = React.useMemo(() => {
        return /^\d{6}$/.test(codeValue.trim())
    }, [codeValue])

    const isStepValid = React.useMemo(() => {
        if (currentStep === 1) return lastName.trim().length > 0 && firstName.trim().length > 0 && middleName.trim().length > 0 && birthday.trim().length == 10 && isUsernameValid
        if (currentStep === 2) return city.trim().length > 0 && street.trim().length > 0
        if (currentStep === 3) return isPhoneValid
        if (currentStep === 4) return isCodeValid
        if (currentStep === 5) {
            return (
                personalDataAgreement &&
                privacyPolicyAgreement &&
                offerAgreement &&
                !!lastName &&
                !!firstName &&
                !!middleName &&
                !!city &&
                isSignupCodeVerified &&
                isPhoneValid &&
                !!birthday
            )
        }
        return false
    }, [currentStep, lastName, firstName, middleName, birthday, city, street, isPhoneValid, isCodeValid, isSignupCodeVerified, isUsernameValid, personalDataAgreement, privacyPolicyAgreement, offerAgreement])

    const verifySignupCode = async () => {
        if (!isCodeValid) return false

        try {
            const cleanPhone = phone.replace(/\D/g, '')
            const formattedPhone = '+' + cleanPhone

            await handleVerifySignupCode({
                phone: formattedPhone,
                code: codeValue
            }).unwrap()

            setIsSignupCodeVerified(true)
            setError({ title: '', description: '' })
            return true
        } catch (err: any) {
            const detail = err?.data?.detail ?? err?.detail

            if (detail?.error === 'ERROR_AUTH_INCORECT_CODE') {
                setError({ title: 'Неверный код', description: 'Введённый код неверный. Попробуйте ещё раз' })
            } else if (detail?.error === 'ERROR_AUTH_EXCEED_VERIVY_CODE' || detail?.error === 'ERROR_AUTH_EXCEDED_LIMIT_CODE_SEND') {
                setError({ title: 'Превышен лимит', description: 'Слишком много неверных попыток. Попробуйте через 30 минут' })
            } else if (detail?.error === 'ERROR_AUTH_USER_CODE_BAN') {
                setError({ title: 'Доступ заблокирован', description: 'Вы временно заблокированы на 30 минут' })
            } else if (detail?.error === 'ERROR_AUTH_CODE_SESSION_IS_NOT_FOUND') {
                setError({ title: 'Код устарел', description: 'Получите новый код подтверждения' })
                setCurrentStep(3)
            } else {
                setError({ title: 'Ошибка проверки', description: 'Не удалось проверить код. Попробуйте позже' })
            }

            return false
        }
    }

    const handleNext = async () => {
        if (currentStep === 4 && !(await verifySignupCode())) return
        if (currentStep < 5) setCurrentStep(prev => prev + 1)
    }

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
        } else {
            window.location.href = '/authorization'
        }
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '')

        if (value.length === 0) {
            setPhone('')
            setCodeValue('')
            setIsSignupCodeVerified(false)
            return
        }

        if (value.startsWith('7') || value.startsWith('8')) value = value.slice(1)

        let formatted = '+7'
        if (value.length > 0) formatted += '(' + value.slice(0, 3)
        if (value.length > 3) formatted += ')' + value.slice(3, 6)
        if (value.length > 6) formatted += '-' + value.slice(6, 8)
        if (value.length > 8) formatted += '-' + value.slice(8, 10)

        setPhone(formatted.slice(0, 16))
        setCodeValue('')
        setIsSignupCodeVerified(false)
    }

    const handleBirthdayChange = (birthdayDate: string) => {
        setBirthday(birthdayDate)
    }

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCodeValue(e.target.value.replace(/\D/g, '').slice(0, 6))
        setIsSignupCodeVerified(false)
    }

    const validateBeforeSendCode = () => {
        if (!lastName.trim() || !firstName.trim() || !middleName.trim() || !birthday.trim() || !username.trim()) {
            setError({
                title: 'Не заполнены данные',
                description: 'Пожалуйста, заполните Фамилию, Имя, Отчество, Юзернейм и Дату рождения'
            })
            setCurrentStep(1)
            return false
        }
        if (username.length < 5) {
            setError({
                title: 'Юзернейм невалиден',
                description: 'Минимальная длина юзернейма - 5 символов'
            })
            setCurrentStep(1)
            return false
        }
        if (!USERNAME_REGEXP.test(username)) {
            setError({
                title: 'Юзернейм невалиден',
                description: 'Юзернейм может содержать только английские буквы'
            })
            setCurrentStep(1)
            return false
        }
        if (!city.trim() || !street.trim()) {
            setError({
                title: 'Не заполнены данные',
                description: 'Пожалуйста, заполните Город и Улицу'
            })
            setCurrentStep(2)
            return false
        }
        return true
    }

    const sendVerificationCode = async () => {
        if (!isPhoneValid) return
        if (!validateBeforeSendCode()) return

        try {
            const cleanPhone = phone.replace(/\D/g, '')
            const formattedPhone = '+' + cleanPhone

            await handleSendVerifyCode({
                phone: formattedPhone,
                auth: false,
                tg: false
            }).unwrap()

            setCodeValue('')
            setIsSignupCodeVerified(false)
            setCurrentStep(4)
            setError({ title: '', description: '' })
        } catch (err: any) {
            const detail = err?.data?.detail ?? err?.detail

            if (detail?.error === 'ERROR_AUTH_INCORECT_LOGIN_PASS') {
                setError({ title: 'Ошибка', description: 'Пользователь с таким номером уже существует' })
            } else if (detail?.error === 'ERROR_AUTH_EXCEDED_LIMIT_SEND_CODE') {
                setError({ title: 'Превышен лимит', description: 'Вы превысили лимит отправки кодов. Попробуйте через 30 минут' })
            } else if (detail?.error === 'ERROR_AUTH_USER_CODE_BAN') {
                setError({ title: 'Доступ заблокирован', description: 'Вы временно заблокированы на 30 минут' })
            } else {
                setError({ title: 'Не удалось отправить код', description: 'Попробуйте позже' })
            }
        }
    }

    const completeRegistration = async () => {
        if (!isCodeValid) return

        try {
            const cleanPhone = phone.replace(/\D/g, '')
            const formattedPhone = '+' + cleanPhone

            const [day, month, year] = birthday.split('.')
            const formattedBirthday = `${year}-${month}-${day}`

            const registrationRes = await handleSignup({
                code: codeValue,
                phone: formattedPhone,
                first_name: firstName,
                last_name: lastName,
                patronymic_name: middleName,
                birthday: formattedBirthday,
                city,
                street,
                house: house || undefined,
                apartment: apartment || undefined,
                tg_id: telegramUser?.id ?? null,
                username: username,
                personal_data_agreement: personalDataAgreement,
                privacy_policy_agreement: privacyPolicyAgreement,
                offer_agreement: offerAgreement,
                marketing_consent: marketingConsent
            }).unwrap()

            localStorage.setItem('justRegistered', 'true')

            if (registrationRes?.data?.access_token && registrationRes?.data?.refresh_token) {
                dispatch(setCredentials({
                    accessToken: registrationRes.data.access_token,
                    refreshToken: registrationRes.data.refresh_token
                }))

                window.location.href = '/dashboard'
            } else {
                window.location.href = '/authorization'
            }
        } catch (err: any) {
            const detail = err?.data?.detail ?? err?.detail

            if (detail?.error === 'ERROR_AUTH_INCORECT_CODE') {
                setError({ title: 'Неверный код', description: 'Введённый код неверный. Попробуйте ещё раз' })
            } else if (detail?.error === 'ERROR_AUTH_EXCEED_VERIVY_CODE' || detail?.error === 'ERROR_AUTH_EXCEDED_LIMIT_CODE_SEND') {
                setError({ title: 'Превышен лимит', description: 'Слишком много неверных попыток. Попробуйте через 30 минут' })
            } else if (detail?.type === 'date_from_datetime_parsing') {
                setError({ title: 'Ошибка формата даты', description: 'Дата рождения должна быть в формате ДД.ММ.ГГГГ' })
            } else if (detail?.error === 'ERROR_AUTH_AGREEMENTS_REQUIRED') {
                setError({ title: 'Нужны согласия', description: 'Поставьте обязательные галочки согласий и попробуйте снова' })
            } else {
                setError({ title: 'Ошибка регистрации', description: 'Не удалось завершить регистрацию. Попробуйте позже' })
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
                        <span className='font-semibold text-[28px] lg:text-[32px] text-[#33331F]'>Регистрация</span>
                    </div>

                    <div className='flex gap-[8px] justify-center'>
                        <div className={`flex items-center justify-center h-[32px] rounded-[1000px] px-[12px] cursor-pointer text-[14px] lg:text-[16px] ${currentStep === 1 ? 'bg-[#ED0028] text-white' : 'border border-[#F1F1F1] text-[#B9B9B9]'}`} onClick={() => setCurrentStep(1)}>Шаг 1</div>
                        <div className={`flex items-center justify-center h-[32px] rounded-[1000px] px-[12px] cursor-pointer text-[14px] lg:text-[16px] ${currentStep === 2 ? 'bg-[#ED0028] text-white' : 'border border-[#F1F1F1] text-[#B9B9B9]'}`} onClick={() => setCurrentStep(2)}>Шаг 2</div>
                        <div className={`flex items-center justify-center h-[32px] rounded-[1000px] px-[12px] cursor-pointer text-[14px] lg:text-[16px] ${currentStep === 3 || currentStep === 4 ? 'bg-[#ED0028] text-white' : 'border border-[#F1F1F1] text-[#B9B9B9]'}`} onClick={() => setCurrentStep(3)}>Шаг 3</div>
                        <div className={`flex items-center justify-center h-[32px] rounded-[1000px] px-[12px] text-[14px] lg:text-[16px] ${isSignupCodeVerified ? 'cursor-pointer' : 'cursor-default'} ${currentStep === 5 ? 'bg-[#ED0028] text-white' : 'border border-[#F1F1F1] text-[#B9B9B9]'}`} onClick={() => isSignupCodeVerified && setCurrentStep(5)}>Итог</div>
                    </div>
                </div>

                {currentStep === 1 && (
                    <div className='flex flex-col gap-[15px] w-[324px] lg:w-[395px] mt-[32px]'>
                        <div className='flex flex-col gap-[8px] w-full'>
                            <span className='font-medium text-[14px] text-[#333333] after:content-["*"] after:text-[#ED0028] after:ml-[2px]'>Фамилия</span>
                            <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} className="outline-none border w-full border-[#B9B9B966] bg-none rounded-[10px] text-[#333333] text-[16px] h-[44px] px-[12px]" placeholder='Петров' />
                        </div>
                        <div className='flex flex-col gap-[8px] w-full'>
                            <span className='font-medium text-[14px] text-[#333333] after:content-["*"] after:text-[#ED0028] after:ml-[2px]'>Имя</span>
                            <input type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} className="outline-none border w-full border-[#B9B9B966] bg-none rounded-[10px] text-[#333333] text-[16px] h-[44px] px-[12px]" placeholder='Василий' />
                        </div>
                        <div className='flex flex-col gap-[8px] w-full'>
                            <span className='font-medium text-[14px] text-[#333333] after:content-["*"] after:text-[#ED0028] after:ml-[2px]'>Отчество</span>
                            <input type='text' value={middleName} onChange={(e) => setMiddleName(e.target.value)} className="outline-none border w-full border-[#B9B9B966] bg-none rounded-[10px] text-[#333333] text-[16px] h-[44px] px-[12px]" placeholder='Иванович' />
                        </div>
                        <div className='flex flex-col gap-[8px] w-full'>
                            <span className='font-medium text-[14px] text-[#333333] after:content-["*"] after:text-[#ED0028] after:ml-[2px]'>Юзернейм</span>
                            <input type='text' value={username} onChange={(e) => setUsername(e.target.value.replace(/[^A-Za-z]/g, ''))} className="outline-none border w-full border-[#B9B9B966] bg-none rounded-[10px] text-[#333333] text-[16px] h-[44px] px-[12px]" maxLength={15} placeholder='cnoriginal' />
                            <span className='text-[12px] leading-[16px] text-[#B9B9B9]'>Только английские буквы, 5–15 символов</span>
                        </div>
                        <div className='flex flex-col gap-[8px] w-full'>
                            <span className='font-medium text-[14px] text-[#333333] after:content-["*"] after:text-[#ED0028] after:ml-[2px]'>Дата рождения</span>
                            <DateInput value={birthday} onChange={handleBirthdayChange} className='w-full rounded-[10px]
text-[16px] h-[44px] px-[12px]'/>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className='flex flex-col gap-[15px] w-[324px] lg:w-[395px] mt-[32px]'>
                        <div className='flex flex-col gap-[8px] w-full'>
                            <span className='font-medium text-[14px] text-[#333333] after:content-["*"] after:text-[#ED0028] after:ml-[2px]'>Город/регион</span>
                            <input type='text' value={city} onChange={(e) => setCity(e.target.value)} className="outline-none border w-full border-[#B9B9B966] bg-none rounded-[10px] text-[#333333] text-[16px] h-[44px] px-[12px]" placeholder='Москва' />
                        </div>
                        <div className='flex flex-col gap-[8px] w-full'>
                            <span className='font-medium text-[14px] text-[#333333] after:content-["*"] after:text-[#ED0028] after:ml-[2px]'>Улица</span>
                            <input type='text' value={street} onChange={(e) => setStreet(e.target.value)} className="outline-none border w-full border-[#B9B9B966] bg-none rounded-[10px] text-[#333333] text-[16px] h-[44px] px-[12px]" placeholder='Пушкина' />
                        </div>
                        <div className='flex gap-[8px] w-full'>
                            <div className='flex flex-col gap-[8px] w-full'>
                                <span className='font-medium text-[14px] text-[#333333]'>Дом</span>
                                <input type='text' value={house} onChange={(e) => setHouse(e.target.value)} className="outline-none border w-full border-[#B9B9B966] bg-none rounded-[10px] text-[#333333] text-[16px] h-[44px] px-[12px]" placeholder='17' />
                            </div>
                            <div className='flex flex-col gap-[8px] w-full'>
                                <span className='font-medium text-[14px] text-[#333333]'>Квартира</span>
                                <input type='text' value={apartment} onChange={(e) => setApartment(e.target.value)} className="outline-none border w-full border-[#B9B9B966] bg-none rounded-[10px] text-[#333333] text-[16px] h-[44px] px-[12px]" placeholder='212' />
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className='flex flex-col gap-[12px] w-[324px] lg:w-[395px] mt-[32px]'>
                        <div className='flex flex-col gap-[8px] w-full'>
                            <span className='font-medium text-[14px] text-[#333333] after:content-["*"] after:text-[#ED0028] after:ml-[2px]'>Телефон</span>
                            <TelInput onChange={handlePhoneChange} className='outline-none border w-full border-[#B9B9B966] bg-none rounded-[10px] text-[#333333] text-[16px] h-[44px] px-[12px]' placeholder='+7(___)___-__-__' value={phone} />
                        </div>
                        <Button disabled={!isPhoneValid || isVerifyCodeSending} clickHandler={sendVerificationCode} buttonText={isVerifyCodeSending ? 'Отправляем...' : 'Получить код'} className='w-full h-[48px] rounded-[12px] text-[16px]' />
                    </div>
                )}

                {currentStep === 4 && (
                    <div className='flex flex-col gap-[12px] w-[324px] lg:w-[395px] mt-[32px]'>
                        <div className='flex flex-col gap-[8px] w-full'>
                            <span className='font-medium text-[14px] text-[#333333] after:content-["*"] after:text-[#ED0028] after:ml-[2px]'>6-значный код</span>
                            <input type='text' value={codeValue} onChange={handleCodeChange} className="outline-none border w-full border-[#B9B9B966] bg-none rounded-[10px] text-[#333333] text-[16px] h-[44px] px-[12px]" placeholder='123456' maxLength={6} />
                        </div>
                    </div>
                )}

                {currentStep === 5 && (
                    <div className='flex flex-col gap-[12px] w-full lg:w-[395px] mt-[32px]'>
                        {
                            !telegramUser ? <TelegramLoginWidget onAuth={(user) => setTelegramUser(user)} botId={TELEGRAM_AUTH_BOT_ID} /> : <div className='w-full h-[56px] flex items-center border border-[#B9B9B94D] rounded-[16px] px-[12px] gap-[12px]'>
                                <div className='flex items-center justify-center w-[32px] h-[32px] rounded-[11px] bg-[#47D40A1A]'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 12C2.25 6.615 6.615 2.25 12 2.25C17.385 2.25 21.75 6.615 21.75 12C21.75 17.385 17.385 21.75 12 21.75C6.615 21.75 2.25 17.385 2.25 12ZM15.61 10.186C15.67 10.1061 15.7134 10.0149 15.7377 9.91795C15.762 9.82098 15.7666 9.72014 15.7514 9.62135C15.7361 9.52257 15.7012 9.42782 15.6489 9.3427C15.5965 9.25757 15.5276 9.18378 15.4463 9.12565C15.3649 9.06753 15.2728 9.02624 15.1753 9.00423C15.0778 8.98221 14.9769 8.97991 14.8785 8.99746C14.7801 9.01501 14.6862 9.05205 14.6023 9.10641C14.5184 9.16077 14.4462 9.23135 14.39 9.314L11.154 13.844L9.53 12.22C9.38783 12.0875 9.19978 12.0154 9.00548 12.0188C8.81118 12.0223 8.62579 12.101 8.48838 12.2384C8.35097 12.3758 8.27225 12.5612 8.26882 12.7555C8.2654 12.9498 8.33752 13.1378 8.47 13.28L10.72 15.53C10.797 15.6069 10.8898 15.6662 10.992 15.7036C11.0942 15.7411 11.2033 15.7559 11.3118 15.7469C11.4202 15.738 11.5255 15.7055 11.6201 15.6519C11.7148 15.5982 11.7967 15.5245 11.86 15.436L15.61 10.186Z" fill="#47D40A" />
                                    </svg>
                                </div>

                                <span className='font-medium text-[16px] text-[#47D40A]'>
                                    Telegram подключен
                                </span>
                            </div>
                        }
                        <span className='text-[13px] leading-[18px] text-[#B9B9B9]'>
                            Telegram можно привязать позже в профиле.
                        </span>

                        <div className='flex flex-col gap-[10px] mt-[4px]'>
                            <label className='flex items-start gap-[10px] text-[13px] leading-[18px] text-[#333333]'>
                                <Checkbox checked={personalDataAgreement} onChange={setPersonalDataAgreement} className='mt-[1px]' />
                                <span>
                                    Согласен на обработку персональных данных по <a href={PRIVACY_POLICY_URL} target='_blank' rel='noreferrer' className='text-[#ED0028] underline underline-offset-4'>политике конфиденциальности</a>
                                </span>
                            </label>
                            <label className='flex items-start gap-[10px] text-[13px] leading-[18px] text-[#333333]'>
                                <Checkbox checked={privacyPolicyAgreement} onChange={setPrivacyPolicyAgreement} className='mt-[1px]' />
                                <span>
                                    Принимаю <a href={PRIVACY_POLICY_URL} target='_blank' rel='noreferrer' className='text-[#ED0028] underline underline-offset-4'>политику конфиденциальности</a>
                                </span>
                            </label>
                            <label className='flex items-start gap-[10px] text-[13px] leading-[18px] text-[#333333]'>
                                <Checkbox checked={offerAgreement} onChange={setOfferAgreement} className='mt-[1px]' />
                                <span>
                                    Принимаю <a href={OFFER_URL} target='_blank' rel='noreferrer' className='text-[#ED0028] underline underline-offset-4'>пользовательское соглашение / оферту</a>
                                </span>
                            </label>
                            <label className='flex items-start gap-[10px] text-[13px] leading-[18px] text-[#333333]'>
                                <Checkbox checked={marketingConsent} onChange={setMarketingConsent} className='mt-[1px]' />
                                <span>
                                    Согласен получать информационную рассылку
                                </span>
                            </label>
                        </div>
                    </div>
                )}

                <div className='flex w-[324px] lg:w-[395px] gap-[8px] mt-[20px] lg:mt-[24px]'>
                    <button type='button' className='w-full h-[48px] rounded-[12px] bg-[#F2F2F2] font-medium text-[#333333] text-[16px] cursor-pointer' onClick={handlePrev}>
                        {currentStep > 1 ? 'Назад' : 'Отмена'}
                    </button>
                    <Button disabled={!isStepValid || (currentStep === 3 && isVerifyCodeSending) || (currentStep === 4 && isSignupCodeVerifying)} clickHandler={currentStep === 5 ? completeRegistration : handleNext} buttonText={currentStep === 5 ? (isSignupProcessing ? 'Завершаем...' : 'Завершить') : currentStep === 4 && isSignupCodeVerifying ? 'Проверяем...' : 'Далее'} className='w-full h-[48px] rounded-[12px] text-[16px]' />
                </div>

                <a href='/authorization' className='mt-[4px]'>
                    <span className='font-medium text-[14px] text-[#ED0028] hover:text-[#C60022] underline underline-offset-4 transition-colors'>Авторизация</span>
                </a>
            </div>
        </>
    )
}

export default Registration

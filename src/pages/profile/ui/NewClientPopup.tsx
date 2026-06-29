import React, { useState, useCallback, useMemo } from 'react'
import Button from '../../../ui/buttons/Button'
import { useNewClientMutation } from '../../../redux/services/clientService'
import TelInput from '../../../ui/inputs/TelInput'
import DateInput from '../../../ui/inputs/DateInput'

type NewClientData = {
    last_name: string
    first_name: string
    patronymic_name: string
    birthday: string
    passport_issue_date: string
    passport_series: string
    passport_number: string
    inn: string
    full_address: string
    city: string
    region: string
    postcode: string
    email: string
    phone_number: string
}

const NewClientPopup: React.FC<{ closeHandler: () => void }> = ({ closeHandler }) => {
    const [fetchToNewClient, { isLoading: isCreatingClient }] = useNewClientMutation()

    const [userData, setUserData] = useState<NewClientData>({
        last_name: '',
        first_name: '',
        patronymic_name: '',
        birthday: '',
        passport_issue_date: '',
        passport_series: '',
        passport_number: '',
        inn: '',
        full_address: '',
        city: '',
        region: '',
        postcode: '',
        email: '',
        phone_number: ''
    })

    const isFormValid = useMemo(() => {
        return Object.values(userData).every(value => value.trim())
    }, [userData])

    const handleInputChange = useCallback(
        (field: keyof NewClientData) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setUserData(prev => ({
                    ...prev,
                    [field]: e.target.value
                }))
            },
        []
    )

    const handleNumberInputChange = useCallback(
        (field: keyof NewClientData, maxLength: number) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, maxLength)

                setUserData(prev => ({
                    ...prev,
                    [field]: value
                }))
            },
        []
    )

    const formatDate = (value: string) => {
        const parts = value.split('.')

        if (parts.length !== 3) return value

        const [day, month, year] = parts

        return `${year}-${month}-${day}`
    }

    const handleButtonClick = async () => {
        try {
            await fetchToNewClient({
                ...userData,
                birthday: formatDate(userData.birthday),
                passport_issue_date: formatDate(userData.passport_issue_date)
            }).unwrap()

            closeHandler()
        } catch (error) {
            console.log(error)
        }
    }

    const renderInput = (
        label: string,
        field: keyof NewClientData,
        placeholder: string,
        maxLength = 255
    ) => (
        <div className='flex flex-col gap-[8px] grow'>
            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                {label}
            </label>

            <input
                type='text'
                value={userData[field]}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={handleInputChange(field)}
                className='w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none'
            />
        </div>
    )

    const renderNumberInput = (
        label: string,
        field: keyof NewClientData,
        placeholder: string,
        maxLength: number
    ) => (
        <div className='flex flex-col gap-[8px] grow'>
            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                {label}
            </label>

            <input
                type='text'
                inputMode='numeric'
                value={userData[field]}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={handleNumberInputChange(field, maxLength)}
                className='w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none'
            />
        </div>
    )

    return (
        <div
            className='fixed top-0 left-0 right-0 bottom-0 bg-black/60 z-[999] flex items-center justify-center'
            onClick={closeHandler}
        >
            <div
                onClick={e => e.stopPropagation()}
                className='p-[20px] lg:p-[28px] border border-[#F3F3F3] rounded-[20px] shadow-[0px_0px_25.8px_0px_#0F0F2B0D] bg-white flex flex-col lg:w-[589px] lg:h-[839px] lg:max-h-fit max-h-[85vh] overflow-y-auto mx-[16px]'
            >
                <span className='font-bold text-[20px] lg:text-[28px] text-[#33331F]'>
                    Новая персона
                </span>

                <div className='mt-[24px] flex flex-col gap-[16px] lg:gap-[24px]'>
                    <span className='font-bold text-[20px] lg:text-[28px] text-[#33331F] lg:flex hidden'>
                        Данные паспорта
                    </span>

                    <div className='flex flex-col gap-[20px]'>
                        {renderInput('Фамилия', 'last_name', 'Иванов', 30)}

                        <div className='flex gap-[8px]'>
                            {renderInput('Имя', 'first_name', 'Иван', 30)}
                            {renderInput('Отчество', 'patronymic_name', 'Иванович', 30)}
                        </div>

                        <div className='flex flex-col gap-[8px] grow'>
                            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                                Дата рождения
                            </label>

                            <DateInput
                                value={userData.birthday}
                                onChange={value =>
                                    setUserData(prev => ({
                                        ...prev,
                                        birthday: value
                                    }))
                                }
                                className='w-full px-[12px] h-[44px] rounded-lg'
                            />
                        </div>

                        <div className='flex flex-col gap-[8px] grow'>
                            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                                Дата выдачи
                            </label>


                            <DateInput
                                value={userData.passport_issue_date}
                                onChange={value =>
                                    setUserData(prev => ({
                                        ...prev,
                                        passport_issue_date: value
                                    }))
                                }
                                className='w-full px-[12px] h-[44px] rounded-lg'
                            />
                        </div>

                        <div className='flex gap-[8px]'>
                            {renderNumberInput('Серия паспорта', 'passport_series', '4512', 4)}
                            {renderNumberInput('Номер паспорта', 'passport_number', '345678', 6)}
                            {renderNumberInput('ИНН', 'inn', '775598987121', 12)}
                        </div>

                        {renderInput('Адрес прописки', 'full_address', 'ул. Ленина, дом 10')}

                        <div className='flex gap-[8px]'>
                            {renderInput('Город', 'city', 'Москва')}
                            {renderInput('Регион', 'region', 'Московская область')}
                        </div>

                        {renderNumberInput('Индекс', 'postcode', '101000', 6)}
                    </div>
                </div>

                <div className='mt-[40px] flex flex-col gap-[24px]'>
                    <span className='font-bold text-[20px] lg:text-[28px] text-[#33331F]'>
                        Личные данные
                    </span>

                    <div className='flex flex-col gap-[20px]'>
                        {renderInput('Эл. почта', 'email', 'mail@gmail.com')}

                        <TelInput
                            value={userData.phone_number}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setUserData((prev) => ({ ...prev, 'phone_number': e.target.value }))
                            }}
                            className='w-full px-[12px] h-[44px]'
                            placeholder='+7(___)___-__-__'
                        />
                    </div>
                </div>

                <div className='flex items-center justify-between mt-[24px] gap-[8px]'>
                    <Button
                        className='grow h-[44px] rounded-[10px] font-medium text-[15px]'
                        buttonText={isCreatingClient ? 'Создаём' : 'Создать'}
                        clickHandler={handleButtonClick}
                        disabled={!isFormValid || isCreatingClient}
                    />

                    <button
                        type='button'
                        onClick={closeHandler}
                        className='grow h-[44px] rounded-[10px] font-medium text-[15px] outline-none border-none bg-[#F5F5F5] text-[#333333] cursor-pointer'
                    >
                        Отменить
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NewClientPopup
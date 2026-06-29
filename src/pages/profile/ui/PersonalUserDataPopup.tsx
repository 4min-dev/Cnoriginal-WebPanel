import React, { useState, useCallback, useMemo } from 'react'
import Button from '../../../ui/buttons/Button'
import type { User } from '../../../types/User'
import { useUpdateProfileMutation } from '../../../redux/services/userService'

type NewClientData = {
    last_name: string,
    first_name: string,
    patronymic_name: string,
    birthday: string,
    passport_issue_date: string,
    passport_series: string,
    passport_number: string,
    inn: string,
    full_address: string,
    full_delivery_address: string,
    city: string,
    region: string,
    postcode: string,
    email: string,
    phone_number: string
}

const PersonalDataPopup: React.FC<{ closeHandler: () => void, user: User }> = ({ closeHandler, user }) => {
    const [fetchToUpdateProfile, { isLoading: isUpdateProfileProcessing }] = useUpdateProfileMutation()

    const [userData, setUserData] = useState<NewClientData>({
        last_name: user.last_name,
        first_name: user.first_name,
        patronymic_name: user.patronymic_name,
        birthday: user.birthday || '',
        passport_issue_date: user.passport_issue_date,
        passport_series: user.passport_series,
        passport_number: user.passport_number,
        inn: user.inn,
        full_address: user.full_address,
        full_delivery_address: user.full_delivery_address,
        city: user.city,
        region: user.region,
        postcode: user.postcode,
        email: user.email,
        phone_number: user.login_phone.toString() || ''
    })

    const isFormValid = useMemo(() => {
        return Object.values(userData).every(
            value => typeof value === 'string' && value.trim()
        )
    }, [userData])

    const handleInputChange =
        useCallback(
            (field: keyof NewClientData) =>
                (e: React.ChangeEvent<HTMLInputElement>) => {
                    setUserData(prev => ({
                        ...prev,
                        [field]: e.target.value
                    }))
                },
            []
        )

    async function handleButtonClick() {
        try {
            await fetchToUpdateProfile(userData).unwrap()
        } catch (error) {
            console.log(error)
        } finally {
            closeHandler()
        }
    }

    const renderInput = (
        label: string,
        field: keyof NewClientData,
        placeholder: string
    ) => (
        <div className='flex flex-col gap-[8px] grow'>
            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                {label}
            </label>

            <input
                type='text'
                value={userData[field]}
                placeholder={placeholder}
                onChange={handleInputChange(field)}
                className='w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none text-[15px] lg:text-[16px]'
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
                className='p-[20px] lg:p-[28px] border border-[#F3F3F3] rounded-[20px] shadow-[0px_0px_25.8px_0px_#0F0F2B0D] bg-white flex flex-col lg:w-[589px] lg:max-h-fit max-h-[85vh] overflow-y-auto mx-[16px]'
            >
                <span className='font-bold text-[20px] lg:text-[28px] text-[#33331F]'>
                    Личные данные
                </span>

                <div className='mt-[24px] flex flex-col'>
                    <div className='flex flex-col gap-[20px]'>
                        {renderInput('Фамилия', 'last_name', 'Иванов')}

                        <div className='flex gap-[8px]'>
                            {renderInput('Имя', 'first_name', 'Иван')}
                            {renderInput('Отчество', 'patronymic_name', 'Иванович')}
                        </div>

                        {renderInput('Эл. почта', 'email', 'mail@gmail.com')}


                        {renderInput(
                            'Адрес доставки',
                            'full_delivery_address',
                            'Инд. 298612, субъект. Республика Крым, г. Ялта, д. 33'
                        )}
                    </div>
                </div>

                <div className='flex items-center justify-between mt-[24px] gap-[8px]'>
                    <Button
                        className='grow h-[44px] rounded-[10px] font-medium text-[15px]'
                        buttonText={isUpdateProfileProcessing ? 'Обновляем' : 'Применить'}
                        clickHandler={handleButtonClick}
                        disabled={!isFormValid || isUpdateProfileProcessing}
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

export default PersonalDataPopup
import React, { useState, useCallback, useMemo } from 'react'
import Button from '../../../ui/buttons/Button'
import type { User } from '../../../types/User'
import { useUpdateProfileMutation } from '../../../redux/services/userService'
import { useUpdateClientDataMutation } from '../../../redux/services/clientService'
import DateInput from '../../../ui/inputs/DateInput'

export type UserDataToChange = {
    last_name?: string,
    first_name?: string,
    patronymic_name?: string,
    birthday?: string,
    passport_issue_date?: string,
    passport_series?: string,
    passport_number?: string,
    inn?: string,
    full_address?: string,
    postcode?: string,
    city?: string,
    region?: string
}

const PassportDataPopup: React.FC<{ closeHandler: () => void, user: User | null, canChange: boolean, isClientData: boolean }> = ({ closeHandler, user, canChange = false, isClientData }) => {

    const [fetchToUpdateClientProfile, { isLoading: isUpdateClientProcessing }] = useUpdateClientDataMutation()
    const [fetchToUpdateProfile, { isLoading: isUpdateProfileProcessing }] = useUpdateProfileMutation()

    const initialUserData = useMemo(() => ({
        last_name: user?.last_name,
        first_name: user?.first_name,
        patronymic_name: user?.patronymic_name,
        birthday: user?.birthday ? new Date(user.birthday).toLocaleDateString('ru-RU') : '',
        passport_issue_date: user?.passport_issue_date ? new Date(user.passport_issue_date).toLocaleDateString('ru-RU') : '',
        passport_series: user?.passport_series,
        passport_number: user?.passport_number,
        inn: user?.inn,
        full_address: user?.full_address,
        postcode: user?.postcode,
        city: user?.city,
        region: user?.region
    }), [user])

    const [userData, setUserData] = useState<UserDataToChange>(initialUserData)

    const validateFields = useCallback(() => {
        if (!canChange) return true

        const requiredFields = [
            userData.last_name,
            userData.first_name,
            userData.patronymic_name,
            userData.birthday,
            userData.passport_issue_date,
            userData.passport_series,
            userData.passport_number,
            userData.inn,
            userData.full_address,
            userData.postcode,
            userData.city,
            userData.region
        ]

        return requiredFields.every(field => field && field.trim() !== '')
    }, [userData, canChange])

    const isButtonDisabled = useMemo(() => !validateFields(), [validateFields])

    const handleInputChange = useCallback((field: keyof UserDataToChange) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData(prev => ({
            ...prev,
            [field]: e.target.value
        }))
    }, [])

    const toIsoDate = (value?: string): string => {
        if (!value) return ''

        if (value.includes('T')) {
            return value
        }

        const [day, month, year] = value.split('.')

        if (!day || !month || !year) return value

        const date = new Date(Date.UTC(
            Number(year),
            Number(month) - 1,
            Number(day),
            12, 0, 0, 0
        ))

        const iso = date.toISOString()
        return iso.replace('.000Z', 'Z')
    }

    async function handleChangeUserData() {
        try {
            const res = await fetchToUpdateProfile({
                ...userData,
                birthday: toIsoDate(userData.birthday),
                passport_issue_date: toIsoDate(userData.passport_issue_date)
            }).unwrap()

            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleChangeClientData() {
        try {
            if (!user) return

            const res = await fetchToUpdateClientProfile({
                client_id: user.id,
                userData: {
                    ...userData,
                    birthday: toIsoDate(userData.birthday),
                    passport_issue_date: toIsoDate(userData.passport_issue_date)
                }
            }).unwrap()

            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleButtonClick() {
        if (canChange) {
            if (isClientData) {
                await handleChangeClientData()
            } else {
                await handleChangeUserData()
            }
        }

        closeHandler()
    }

    return (
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/60 z-[999] flex items-center justify-center" onClick={closeHandler}>
            <div
                className={`p-[28px] border border-[#F3F3F3] rounded-[20px] 
             shadow-[0px_0px_25.8px_0px_#0F0F2B0D] lg:mr-0 lg:ml-0 mr-[16px] ml-[16px] relative bg-white flex flex-col  lg:w-[589px] lg:h-[839px] h-[50vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
                <button type='button' className='bg-none outline-none border-none cursor-pointer absolute top-[20px] right-[20px]' onClick={closeHandler}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clip-path="url(#clip0_1326_17265)">
                            <path d="M7 7L17 17M7 17L17 7" stroke="#B3B3B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1326_17265">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>

                <span className='font-bold text-[20px] lg:text-[28px] text-[#33331F]'>
                    Данные паспорта
                </span>

                <div className='flex flex-col gap-[20px]'>
                    <div className='mt-[24px] flex flex-col gap-[8px]'>
                        <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                            Фамилия
                        </label>
                        <input
                            readOnly={!canChange}
                            type="text"
                            value={userData.last_name || ''}
                            placeholder={"Иванов"}
                            onChange={handleInputChange('last_name')}
                            className="w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none lg:text-[16px] text-[15px]"
                        />
                    </div>

                    <div className='flex gap-[8px]'>
                        <div className='flex flex-col gap-[8px] grow'>
                            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                                Имя
                            </label>
                            <input
                                readOnly={!canChange}
                                type="text"
                                value={userData.first_name || ''}
                                placeholder={"Иван"}
                                onChange={handleInputChange('first_name')}
                                className="w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none lg:text-[16px] text-[15px]"
                            />
                        </div>

                        <div className='flex flex-col gap-[8px] grow'>
                            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                                Отчество
                            </label>
                            <input
                                readOnly={!canChange}
                                type="text"
                                value={userData.patronymic_name || ''}
                                placeholder={"Иванович"}
                                onChange={handleInputChange('patronymic_name')}
                                className="w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none lg:text-[16px] text-[15px]"
                            />
                        </div>
                    </div>

                    <div className='flex gap-[8px]'>
                        <div className='flex flex-col gap-[8px] grow'>
                            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                                Дата рождения
                            </label>
                            <DateInput readOnly={!canChange} value={userData?.birthday || ''} onChange={(birthdayDate: string) => setUserData(prev => ({ ...prev, birthday: birthdayDate }))} className='w-full px-[12px] h-[44px]' />
                        </div>

                        <div className='flex flex-col gap-[8px] grow'>
                            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                                Дата выдачи
                            </label>
                            <DateInput readOnly={!canChange} value={userData?.passport_issue_date || ''} onChange={(passportIssueDate: string) => setUserData(prev => ({ ...prev, passport_issue_date: passportIssueDate }))} className='w-full px-[12px] h-[44px]' />
                        </div>
                    </div>

                    <div className='flex gap-[8px]'>
                        <div className='flex flex-col gap-[8px] grow'>
                            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                                Серия паспорта
                            </label>
                            <input
                                readOnly={!canChange}
                                type="text"
                                maxLength={4}
                                value={userData.passport_series || ''}
                                placeholder={"4512"}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setUserData((prev) => ({ ...prev, 'passport_series': e.target.value.replace(/\D/g, '') }))
                                }}
                                className="w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none lg:text-[16px] text-[15px]"
                            />
                        </div>

                        <div className='flex flex-col gap-[8px] grow'>
                            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                                Номер паспорта
                            </label>
                            <input
                                readOnly={!canChange}
                                type="text"
                                maxLength={6}
                                value={userData.passport_number || ''}
                                placeholder={"345678"}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setUserData((prev) => ({ ...prev, 'passport_number': e.target.value.replace(/\D/g, '') }))
                                }}
                                className="w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none lg:text-[16px] text-[15px]"
                            />
                        </div>

                        <div className='flex flex-col gap-[8px] grow'>
                            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                                ИНН
                            </label>
                            <input
                                readOnly={!canChange}
                                type="text"
                                maxLength={12}
                                value={userData.inn || ''}
                                placeholder={"775598987121"}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setUserData((prev) => ({ ...prev, 'inn': e.target.value.replace(/\D/g, '') }))
                                }}
                                className="w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none lg:text-[16px] text-[15px]"
                            />
                        </div>
                    </div>
                </div>

                <div className='mt-[32px] flex flex-col gap-[24px]'>
                    <span className='font-bold text-[20px] lg:text-[28px] text-[#33331F]'>
                        Адрес прописки
                    </span>

                    <div className='flex flex-col gap-[20px]'>
                        <div className='flex flex-col gap-[8px] grow'>
                            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                                Полный адрес
                            </label>
                            <input
                                readOnly={!canChange}
                                type="text"
                                value={userData.full_address || ''}
                                placeholder={"Инд. 298612, субъект. Республика Крым, г. Ялта, д. 33"}
                                onChange={handleInputChange('full_address')}
                                className="w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none lg:text-[16px] text-[15px]"
                            />
                        </div>

                        <div className='flex gap-[8px]'>
                            <div className='flex flex-col gap-[8px] grow'>
                                <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                                    Индекс
                                </label>
                                <input
                                    readOnly={!canChange}
                                    type="text"
                                    value={userData.postcode || ''}
                                    placeholder={"298612"}
                                    onChange={handleInputChange('postcode')}
                                    className="w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none lg:text-[16px] text-[15px]"
                                />
                            </div>

                            <div className='flex flex-col gap-[8px] grow'>
                                <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                                    Город
                                </label>
                                <input
                                    readOnly={!canChange}
                                    type="text"
                                    value={userData.city || ''}
                                    placeholder={"Ялта"}
                                    onChange={handleInputChange('city')}
                                    className="w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none lg:text-[16px] text-[15px]"
                                />
                            </div>
                        </div>

                        <div className='flex flex-col gap-[8px] grow'>
                            <label className='font-medium text-[13px] lg:text-[14px] text-[#333333]'>
                                Субъект
                            </label>
                            <input
                                readOnly={!canChange}
                                type="text"
                                value={userData.region || ''}
                                placeholder={"Республика Крым"}
                                onChange={handleInputChange('region')}
                                className="w-full px-[12px] h-[44px] border border-[#E0E0E0] rounded-lg focus:outline-none lg:text-[16px] text-[15px]"
                            />
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-between mt-[20px] lg:mt-[24px] gap-[8px]'>
                    <Button
                        className='grow h-[44px] rounded-[10px] font-medium text-[15px]'
                        buttonText={(isUpdateProfileProcessing || isUpdateClientProcessing) ? 'Обновляем' : 'Применить'}
                        clickHandler={handleButtonClick}
                        disabled={isButtonDisabled || isUpdateProfileProcessing || isUpdateClientProcessing}
                    />

                    <button
                        type='button'
                        className='grow h-[44px] rounded-[10px] font-medium text-[15px] outline-none border-none bg-[#F5F5F5] text-[#333333] cursor-pointer'
                        onClick={closeHandler}
                    >
                        Отменить
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PassportDataPopup
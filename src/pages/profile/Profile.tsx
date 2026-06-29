import React, { useMemo, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../ui/buttons/Button'
import { useGetReferralsHistoryQuery, useGetReferralsQuery } from '../../redux/services/referralService'
import getReferralsValue from '../../utils/text/getReferralsValue'
import DocumentsIcon from '../../ui/icons/DocumentsIcon'
import { useGetBalanceQuery } from '../../redux/services/balanceService'
import type { BalanceTransaction } from '../../redux/services/balanceService'
import { useDeleteClientMutation, useGetUserClientsQuery } from '../../redux/services/clientService'
import Popup from '../../ui/popup/Popup'
import SuccessIcon from '../../ui/icons/SuccessIcon'
import { copyToClipboard } from '../../utils/text/copyToClipboard'
import PassportDataPopup from './ui/PassportDataPopup'
import type { User } from '../../types/User'
import { usePayment } from '../../hooks/usePayment'
import NewClientPopup from './ui/NewClientPopup'
import PersonalDataPopup from './ui/PersonalUserDataPopup'
import UserAvatarPopup from './ui/UserAvatarPopup'
import ErrorIcon from '../../ui/icons/ErrorIcon'
import isMobileDevice from '../../assets/isMobileDevice'
import MobilePlusIcon from '../../ui/icons/MobilePlusIcon'
import { useLazyGetUrlTransactionsSheetQuery } from '../../redux/services/sheetsService'
import { HandCoins, RefreshCw, ShoppingBag, WalletCards } from 'lucide-react'

const filters = [
    {
        id: 1,
        name: 'Все',
        value: 'all'
    },
    {
        id: 2,
        name: 'Покупки',
        value: 'spent'
    },
    {
        id: 3,
        name: 'Пополнения',
        value: 'funding'
    },
    {
        id: 4,
        name: 'Рефералы',
        value: 'referrals'
    },
]

type ProfileTransaction = Pick<
    BalanceTransaction,
    'id' | 'amount' | 'comment' | 'type' | 'created_at'
> & Partial<
    Pick<BalanceTransaction, 'order_description' | 'order_tracking_number'>
>

function getTransactionPresentation(transaction: ProfileTransaction) {
    const isSubscription = transaction.type === 'minus'
        && transaction.comment.toLowerCase().includes('подписк')
    const isOrderPayment = transaction.type === 'minus'
        && (
            Boolean(transaction.order_description)
            || transaction.comment.toLowerCase().startsWith('оплата заказа')
        )

    if (isSubscription) {
        return {
            Icon: RefreshCw,
            title: transaction.comment,
            description: 'Регулярная покупка',
            iconClasses: 'bg-[#1D7BFF1A] text-[#1D7BFF]',
        }
    }

    if (isOrderPayment) {
        const orderDetails = [
            transaction.order_description,
            transaction.order_tracking_number
                ? `Трек: ${transaction.order_tracking_number}`
                : null,
        ].filter(Boolean).join(' · ')

        return {
            Icon: ShoppingBag,
            title: 'Оплата заказа',
            description: orderDetails || transaction.comment,
            iconClasses: 'bg-[#ED00281A] text-[#ED0028]',
        }
    }

    if (transaction.type === 'plus') {
        return {
            Icon: WalletCards,
            title: transaction.comment,
            description: 'Пополнение баланса',
            iconClasses: 'bg-[#21A3661A] text-[#21A366]',
        }
    }

    return {
        Icon: HandCoins,
        title: transaction.comment,
        description: null,
        iconClasses: 'bg-[#ED00281A] text-[#ED0028]',
    }
}

function TransactionIcon({ transaction }: { transaction: ProfileTransaction }) {
    const { Icon, iconClasses } = getTransactionPresentation(transaction)

    return (
        <div className={`flex h-[28px] w-[28px] lg:h-[36px] lg:w-[36px] shrink-0 items-center justify-center rounded-[8px] ${iconClasses}`}>
            <Icon className='h-[16px] w-[16px] lg:h-[20px] lg:w-[20px]' strokeWidth={2} />
        </div>
    )
}

function formatProfileDate(value?: string | null) {
    if (!value) return 'Не указано'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Не указано'

    return date.toLocaleDateString('ru-RU')
}

const Profile: React.FC = () => {
    const { openPaymentPopup } = usePayment()

    const [getTransactionsSheet, { isFetching: isDownloadingSheet }] = useLazyGetUrlTransactionsSheetQuery()
    const { data: referralsHistoryData } = useGetReferralsHistoryQuery()
    const { data: referralsData } = useGetReferralsQuery()
    const { data: balanceData } = useGetBalanceQuery({})
    const { data: clients } = useGetUserClientsQuery()

    const [fetchToDeleteClient, { isLoading: isDeleteClientProcessing }] = useDeleteClientMutation()

    const { user, refetchProfile } = useAuth()

    const [userAvatarError, setUserAvatarError] = useState<{ title: string, description: string } | null>({ title: '', description: '' })
    const [selectedInfoClient, setSelectedInfoClient] = useState<User | null>(null)
    const [selectedChangeClient, setSelectedChangeClient] = useState<User | null>(null)
    const [isPersonalDataUserPopup, setIsPersonalDataUserPopup] = useState<boolean>(false)
    const [isProfileAvatarPopup, setIsProfileAvatarPopup] = useState<boolean>(false)
    const [isNewClientPopup, setIsNewClientPopup] = useState<boolean>(false)
    const [isUserEditPopup, setIsUserEditPopup] = useState<boolean>(false)
    const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false)
    const [isClientsFullHeight, setIsClientsFullHeight] = useState<boolean>(false)
    const [selectedFilter, setSelectedFilter] = useState<string>('all')

    const balanceTransactions = balanceData?.data

    const filteredTransactions = useMemo(() => {
        if (!balanceTransactions) return []

        switch (selectedFilter) {
            case 'spent':
                return balanceTransactions.filter((t: { type: string }) => t.type === 'minus')

            case 'funding':
                return balanceTransactions.filter((t: { type: string }) => t.type === 'plus')

            case 'referrals':
                console.log('referralsHistoryData', referralsHistoryData)
                return referralsHistoryData?.data?.map((referral) => ({
                    id: referral.id,
                    amount: referral.bonus_paid,
                    comment: referral.month,
                    type: 'plus' as const,
                    created_at: referral.created_at,
                })) || []

            case 'all':
            default:
                return balanceTransactions
        }
    }, [balanceTransactions, selectedFilter, referralsHistoryData])

    async function handleDeleteClient(client_id: string) {
        try {
            await fetchToDeleteClient(client_id).unwrap()
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDownloadTransactions() {
        try {
            const result = await getTransactionsSheet(undefined, true).unwrap()

            const sheetUrl = result.data
            const fileUrl = `${sheetUrl}/export?format=xlsx`

            const link = document.createElement('a')
            link.href = fileUrl
            link.download = 'orders.xlsx'
            document.body.appendChild(link)
            link.click()
            link.remove()

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            {
                userAvatarError?.title && (
                    <Popup
                        icon={<ErrorIcon />}
                        title={userAvatarError.title}
                        description={userAvatarError.description}
                        buttonText='Хорошо'
                        buttonHandler={() => setUserAvatarError({ title: '', description: '' })}
                        closeHandler={() => setUserAvatarError({ title: '', description: '' })}
                        popupClassname='lg:w-[480px]'
                    />
                )
            }

            {
                isProfileAvatarPopup && (
                    <UserAvatarPopup closeHandler={() => setIsProfileAvatarPopup(false)} setError={setUserAvatarError} userAvatar={user?.avatar_url} refetchProfile={refetchProfile} />
                )
            }

            {
                isPersonalDataUserPopup && (
                    <PersonalDataPopup closeHandler={() => setIsPersonalDataUserPopup(false)} user={user!} />
                )
            }

            {
                isNewClientPopup && (
                    <NewClientPopup closeHandler={() => setIsNewClientPopup(false)} />
                )
            }

            {
                isUserEditPopup && (
                    <PassportDataPopup closeHandler={() => setIsUserEditPopup(false)} user={user} canChange={true} isClientData={false} />
                )
            }

            {
                (selectedInfoClient || selectedChangeClient) && (
                    <PassportDataPopup closeHandler={() => {
                        setSelectedInfoClient(null)
                        setSelectedChangeClient(null)
                    }} canChange={selectedChangeClient !== null} user={selectedInfoClient || selectedChangeClient} isClientData={!!selectedChangeClient} />
                )
            }

            {
                isLinkCopied && (
                    <Popup
                        icon={<SuccessIcon />}
                        title='Ссылка скопирована!'
                        description='Реферальная ссылка успешно скопирована в буфер обмена.'
                        buttonText='Хорошо'
                        buttonHandler={() => setIsLinkCopied(false)}
                        closeHandler={() => setIsLinkCopied(false)}
                        popupClassname='lg:w-[480px]'
                    />
                )
            }

            <div className='lg:pl-[24px] lg:pr-[24px] lg:pb-[79px] pl-[16px] pr-[16px] pb-[50px]'>
                <div className='pt-[86px] lg:pt-[124px]'>
                    <div className='absolute top-0 left-0 right-0 w-full h-[168px] lg:h-[200px] z-[-1]'>
                        <img src='/images/abstractGradient.jpg' alt='abstractGradient.jpg' className='w-full h-full object-cover' />
                    </div>

                    <div className='flex flex-col lg:flex-row gap-[12px] lg:gap-[16px]'>
                        <div className='flex flex-col lg:flex-row items-center justify-between p-[16px] lg:p-[24px] rounded-[20px] lg:rounded-[24px] bg-white grow shadow-[0px_0px_25.8px_0px_rgba(15,15,43,0.05)]'>
                            <div className='flex items-center gap-[16px] lg:gap-[24px]'>
                                <img src={user?.avatar_url || '/images/user.svg'} alt='avatar' className='w-[104px] h-[104px] rounded-[20px] border-[6px] border-[#FCFDFF] object-cover' />

                                <div className='flex flex-col gap-[8px] lg:gap-[14px]'>
                                    <span className='font-medium text-[20px] lg:text-[28px] text-[#33331F]'>
                                        {user?.last_name} {user?.first_name} {user?.patronymic_name}
                                    </span>

                                    {user?.username && (
                                        <div className='flex items-center gap-[6px]'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <g clip-path="url(#clip0_962_10223)">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM10.3583 7.38244C9.38575 7.787 7.44179 8.62433 4.52659 9.89442C4.05321 10.0827 3.80523 10.2668 3.78266 10.4469C3.7445 10.7512 4.12561 10.8711 4.64458 11.0343C4.71517 11.0565 4.78832 11.0795 4.8633 11.1038C5.37388 11.2698 6.0607 11.464 6.41776 11.4717C6.74163 11.4787 7.10312 11.3452 7.50222 11.0711C10.226 9.2325 11.632 8.30317 11.7202 8.28314C11.7826 8.26901 11.8688 8.25123 11.9273 8.30321C11.9858 8.35517 11.9801 8.45358 11.9738 8.48C11.9361 8.64092 10.4401 10.0317 9.66592 10.7515C9.42458 10.9758 9.25342 11.135 9.21842 11.1713C9.14 11.2528 9.06008 11.3298 8.98333 11.4038C8.509 11.8611 8.15328 12.204 9.003 12.764C9.41142 13.0331 9.73817 13.2556 10.0642 13.4776C10.4202 13.7201 10.7752 13.9619 11.2347 14.2631C11.3517 14.3398 11.4635 14.4195 11.5724 14.4971C11.9867 14.7925 12.359 15.0578 12.8188 15.0155C13.0861 14.9909 13.3621 14.7397 13.5022 13.9903C13.8335 12.2193 14.4847 8.38208 14.6352 6.80082C14.6484 6.66227 14.6318 6.48497 14.6185 6.40715C14.6052 6.32932 14.5773 6.21842 14.4762 6.13633C14.3563 6.03912 14.1714 6.01862 14.0887 6.02007C13.7125 6.0267 13.1355 6.22735 10.3583 7.38244Z" fill="#B9B9B9" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_962_10223">
                                                        <rect width="20" height="20" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span className='text-[14px] lg:text-[20px] text-[#B9B9B9]'>
                                                {user.username}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='flex flex-col gap-[8px] w-full lg:w-fit lg:mt-0 mt-[16px]'>
                                <button type='button' className='w-full lg:w-[200px] h-[44px] lg:h-[48px] rounded-[12px] border border-[#F1F1F1] bg-[#FFFFFF] font-medium text-[15px] lg:text-[16px] text-[#333333] cursor-pointer' onClick={() => setIsPersonalDataUserPopup(true)}>
                                    Редактировать
                                </button>

                                <Button className='w-full lg:w-[200px] h-[44px] lg:h-[48px] rounded-[12px] font-medium text-[15px] lg:text-[16px] text-[#333333]' buttonText='Изменить фото' clickHandler={() => setIsProfileAvatarPopup(true)} />
                            </div>
                        </div>

                        <div className='p-[20px] w-full lg:w-[284px] rounded-[20px] lg:rounded-[24px] bg-[#ED0028] flex flex-col gap-[19px] lg:gap-[12px]'>
                            <div className='flex justify-between'>
                                <div className='flex flex-col gap-[4px]'>
                                    <span className='text-[14px] lg:text-[16px] text-[#FFFFFF] opacity-[60%]'>
                                        Баланс
                                    </span>

                                    <span className='font-semibold text-[20px] lg:text-[24px] text-[#FFFFFF]'>
                                        {`${user?.balance.toLocaleString('ru-RU')} ₽`}
                                    </span>
                                </div>

                                <div className='flex items-center justify-center h-[24px] px-[6px] rounded-[12px] bg-[#FFFFFF4D] gap-[2px]'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <g clip-path="url(#clip0_975_10305)">
                                            <path d="M11.334 11.3333L11.334 4.66667M11.334 4.66667L4.66732 4.66667M11.334 4.66667L4.66732 11.3333" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_975_10305">
                                                <rect width="16" height="16" fill="white" transform="matrix(1 0 0 -1 0 16)" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                    <span className='font-medium text-[14px] lg:text-[13px] text-[#FFFFFF]'>
                                        {`${referralsData?.data.sum.toLocaleString('ru-RU')} ₽`}
                                    </span>
                                </div>
                            </div>

                            <button type='button' className='w-full h-[48px] rounded-[12px] bg-[#FFFFFF] flex items-center justify-center gap-[4px] lg:gap-[8px] cursor-pointer shadow-[0px_0px_25.8px_0px_rgba(15,15,43,0.15)]' onClick={openPaymentPopup}>
                                <span className='font-medium text-[15px] lg:text-[16px] text-[#ED0028]'>
                                    Пополнить баланс
                                </span>

                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.875C5.5125 1.875 1.875 5.5125 1.875 10C1.875 14.4875 5.5125 18.125 10 18.125C14.4875 18.125 18.125 14.4875 18.125 10C18.125 5.5125 14.4875 1.875 10 1.875ZM10.625 7.5C10.625 7.33424 10.5592 7.17527 10.4419 7.05806C10.3247 6.94085 10.1658 6.875 10 6.875C9.83424 6.875 9.67527 6.94085 9.55806 7.05806C9.44085 7.17527 9.375 7.33424 9.375 7.5V9.375H7.5C7.33424 9.375 7.17527 9.44085 7.05806 9.55806C6.94085 9.67527 6.875 9.83424 6.875 10C6.875 10.1658 6.94085 10.3247 7.05806 10.4419C7.17527 10.5592 7.33424 10.625 7.5 10.625H9.375V12.5C9.375 12.6658 9.44085 12.8247 9.55806 12.9419C9.67527 13.0592 9.83424 13.125 10 13.125C10.1658 13.125 10.3247 13.0592 10.4419 12.9419C10.5592 12.8247 10.625 12.6658 10.625 12.5V10.625H12.5C12.6658 10.625 12.8247 10.5592 12.9419 10.4419C13.0592 10.3247 13.125 10.1658 13.125 10C13.125 9.83424 13.0592 9.67527 12.9419 9.55806C12.8247 9.44085 12.6658 9.375 12.5 9.375H10.625V7.5Z" fill="#ED0028" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-col gap-[12px] lg:gap-[16px] mt-[12px] lg:mt-[16px]'>
                        <section className='flex flex-col gap-[20px] lg:gap-[28px] bg-[#FFFFFF] p-[16px] lg:p-[24px] shadow-[0px_0px_25.8px_0px_rgba(15,15,43,0.05)] rounded-[20px]'>
                            <div className='flex min-w-0 items-center justify-between gap-[12px]'>
                                <div className='min-w-0'>
                                    <h2 className='font-medium text-[20px] lg:text-[24px] text-[#33331F]'>
                                        Данные паспорта
                                    </h2>
                                    <p className='mt-[4px] text-[13px] lg:hidden text-[#B9B9B9]'>
                                        Используются для оформления заказов
                                    </p>
                                </div>

                                <button
                                    type='button'
                                    aria-label='Редактировать паспортные данные'
                                    title='Редактировать паспортные данные'
                                    className='flex h-[44px] w-[44px] lg:h-[48px] lg:w-[56px] shrink-0 cursor-pointer items-center justify-center rounded-[12px] border border-[#F1F1F1] bg-[#FDFDFD] outline-none transition-colors hover:bg-[#F7F7F7]'
                                    onClick={() => setIsUserEditPopup(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className='h-[22px] w-[22px] lg:h-[24px] lg:w-[24px]' viewBox="0 0 24 24" fill="none">
                                        <path d="M18.8057 8.19855L7.00977 19.9954C6.45176 20.5537 5.76328 20.9643 5.00684 21.1898L2.32129 21.9896C2.27811 22.0024 2.23215 22.0035 2.18848 21.9925C2.14488 21.9814 2.10505 21.9589 2.07324 21.9271C2.04144 21.8953 2.01889 21.8554 2.00781 21.8118C1.99676 21.7682 1.99789 21.7222 2.01074 21.679L2.81055 18.9935C3.03601 18.237 3.44659 17.5486 4.00488 16.9905L15.8008 5.19366L18.8057 8.19855ZM19.875 2.00031C20.4385 2.00031 20.9794 2.22394 21.3779 2.62238C21.7763 3.02087 22 3.56181 22 4.12531C21.9999 4.68861 21.7761 5.22885 21.3779 5.62726L20.5742 6.43097L17.5693 3.42609L18.373 2.62238C18.7715 2.22415 19.3117 2.00037 19.875 2.00031Z" fill="#333333" stroke="#333333" />
                                    </svg>
                                </button>
                            </div>

                            <div className='grid min-w-0 grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,2.4fr)_repeat(4,minmax(110px,0.65fr))] xl:gap-[32px]'>
                                <div className='min-w-0 border-b border-[#F1F1F1] pb-[18px] xl:border-b-0 xl:pb-0'>
                                    <span className='text-[14px] lg:text-[18px] text-[#B9B9B9]'>
                                        Прописка
                                    </span>
                                    <p className='mt-[8px] lg:mt-[16px] break-words font-medium text-[16px] lg:text-[20px] leading-[1.4] text-[#33331F]'>
                                        {user?.full_address || 'Не указано'}
                                    </p>
                                </div>

                                <div className='grid grid-cols-1 min-[360px]:grid-cols-2 gap-x-[16px] gap-y-[18px] xl:contents'>
                                    <div className='min-w-0'>
                                        <span className='text-[13px] lg:text-[18px] text-[#B9B9B9]'>
                                            Серия
                                        </span>
                                        <p className='mt-[6px] lg:mt-[16px] break-words font-medium text-[16px] lg:text-[20px] text-[#33331F]'>
                                            {user?.passport_series || 'Не указано'}
                                        </p>
                                    </div>

                                    <div className='min-w-0'>
                                        <span className='text-[13px] lg:text-[18px] text-[#B9B9B9]'>
                                            Номер
                                        </span>
                                        <p className='mt-[6px] lg:mt-[16px] break-words font-medium text-[16px] lg:text-[20px] text-[#33331F]'>
                                            {user?.passport_number || 'Не указано'}
                                        </p>
                                    </div>

                                    <div className='min-w-0'>
                                        <span className='text-[13px] lg:text-[18px] text-[#B9B9B9]'>
                                            Дата выдачи
                                        </span>
                                        <p className='mt-[6px] lg:mt-[16px] break-words font-medium text-[16px] lg:text-[20px] text-[#33331F]'>
                                            {formatProfileDate(user?.passport_issue_date)}
                                        </p>
                                    </div>

                                    <div className='min-w-0'>
                                        <span className='text-[13px] lg:text-[18px] text-[#B9B9B9]'>
                                            Дата рождения
                                        </span>
                                        <p className='mt-[6px] lg:mt-[16px] break-words font-medium text-[16px] lg:text-[20px] text-[#33331F]'>
                                            {formatProfileDate(user?.birthday)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className='flex lg:flex-row flex-col gap-[12px] lg:gap-[16px]'>
                            <div className='flex flex-col pt-[20px] pr-[20px] pl-[20px] pb-[16px] gap-[20px] bg-[#FFFFFF] shadow-[0px_0px_25.8px_0px_rgba(15,15,43,0.05)] rounded-[20px] lg:order-none order-[1]'>
                                <div className='flex flex-col text-[4px] lg:gap-[8px]'>
                                    <span className='font-semibold text-[20px] lg:text-[24px] text-[#333333]'>
                                        {`${referralsData?.data.sum.toLocaleString('ru-RU')} ₽`}
                                    </span>

                                    <span className='text-[14px] lg:text-[16px] text-[#B9B9B9]'>
                                        Заработано
                                    </span>
                                </div>

                                <a href="http://cnoriginal.ru"
                                    target="_blank"
                                    rel="noopener noreferrer" className='pt-[12px] flex justify-between items-center border-t border-transparent 
            bg-[repeating-linear-gradient(90deg,#E7E7E7_0,#E7E7E7_10px,transparent_10px,transparent_28px)] 
            bg-[length:100%_1.5px] 
            bg-[position:top] 
            bg-no-repeat w-full lg:w-[284px]'>
                                    <span className='font-medium text-[14px] lg:text-[16px] text-[#333333]'>
                                        О программе
                                    </span>

                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5667 9.55837C13.6837 9.67556 13.7495 9.83441 13.7495 10C13.7495 10.1657 13.6837 10.3245 13.5667 10.4417L7.3167 16.6917C7.19822 16.8021 7.04152 16.8622 6.8796 16.8593C6.71768 16.8565 6.56319 16.7909 6.44868 16.6764C6.33417 16.5619 6.26858 16.4074 6.26572 16.2455C6.26287 16.0836 6.32297 15.9268 6.43337 15.8084L12.2417 10L6.43337 4.1917C6.32297 4.07322 6.26287 3.91652 6.26572 3.7546C6.26858 3.59268 6.33417 3.43819 6.44868 3.32368C6.56319 3.20917 6.71768 3.14358 6.8796 3.14072C7.04152 3.13787 7.19822 3.19797 7.3167 3.30837L13.5667 9.55837Z" fill="#B9B9B9" />
                                    </svg>
                                </a>
                            </div>

                            <div className='flex lg:flex-row flex-col gap-[16px] lg:gap-[8px] grow'>
                                {
                                    !isMobileDevice() && (
                                        <div className='flex flex-col p-[20px] gap-[16px] lg:gap-[19px] bg-[#FFFFFF] shadow-[0px_0px_25.8px_0px_rgba(15,15,43,0.05)] rounded-[20px] grow'>
                                            <div className='flex items-center gap-[8px]'>
                                                <span className='text-[18px] lg:text-[24px] text-[#33331F] font-medium'>
                                                    Реферальная ссылка
                                                </span>

                                                <span className='flex items-center justify-center h-[22px] px-[6px] rounded-[12px] bg-[#1D7BFF] text-[15px] text-[#FFFFFF]'>
                                                    {getReferralsValue(referralsData?.data.referrals || 0)}
                                                </span>
                                            </div>

                                            <div className='flex gap-[12px]'>
                                                <div className='flex items-center px-[14px] lg:px-[15px] h-[48px] lg:h-[56px] gap-[8px] lg:gap-[16px] 
                    rounded-[14px] bg-[#F9F9F9] border border-[#B9B9B933] 
                    min-w-0 flex-1 overflow-hidden'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.4915 2.50855C17.1613 2.17832 16.7694 1.91636 16.338 1.73764C15.9066 1.55892 15.4442 1.46693 14.9772 1.46693C14.5103 1.46693 14.0479 1.55892 13.6165 1.73764C13.1851 1.91636 12.7932 2.17832 12.463 2.50855L8.19682 6.77475C7.79434 7.17688 7.49424 7.66973 7.32175 8.2119C7.14926 8.75407 7.10941 9.32972 7.20555 9.89048C7.30169 10.4512 7.53101 10.9807 7.87425 11.4345C8.21748 11.8883 8.6646 12.253 9.17805 12.4981C9.34235 12.5828 9.46723 12.7281 9.52621 12.9033C9.58519 13.0784 9.57363 13.2697 9.49399 13.4365C9.41435 13.6033 9.27288 13.7325 9.09958 13.7968C8.92627 13.8611 8.73475 13.8553 8.56561 13.7808C7.8471 13.4376 7.22142 12.927 6.74111 12.2919C6.2608 11.6568 5.93988 10.9157 5.8053 10.1309C5.67072 9.34604 5.72641 8.54039 5.96768 7.78154C6.20895 7.0227 6.62877 6.33281 7.19189 5.76982L11.4581 1.50362C11.918 1.03162 12.4671 0.655663 13.0735 0.397565C13.6799 0.139467 14.3315 0.00436672 14.9906 0.000104119C15.6496 -0.00415848 16.3029 0.122501 16.9126 0.372734C17.5223 0.622966 18.0762 0.991789 18.5422 1.4578C19.0082 1.92381 19.377 2.47773 19.6273 3.08741C19.8775 3.6971 20.0042 4.35041 19.9999 5.00943C19.9956 5.66845 19.8605 6.32007 19.6024 6.92647C19.3443 7.53286 18.9684 8.08196 18.4964 8.54191L16.8307 10.2076C16.7656 10.2775 16.6871 10.3335 16.5999 10.3724C16.5126 10.4112 16.4185 10.4321 16.323 10.4338C16.2275 10.4355 16.1327 10.4179 16.0442 10.3822C15.9556 10.3464 15.8752 10.2932 15.8077 10.2257C15.7402 10.1582 15.6869 10.0777 15.6512 9.98919C15.6154 9.90065 15.5979 9.80582 15.5995 9.71035C15.6012 9.61488 15.6221 9.52073 15.661 9.43351C15.6998 9.34629 15.7559 9.26779 15.8257 9.20269L17.4915 7.53698C17.8217 7.20684 18.0836 6.81488 18.2624 6.38348C18.4411 5.95209 18.5331 5.48971 18.5331 5.02276C18.5331 4.55581 18.4411 4.09344 18.2624 3.66204C18.0836 3.23065 17.8217 2.83869 17.4915 2.50855ZM10.4863 6.55386C10.5677 6.38378 10.7133 6.25299 10.8911 6.19023C11.0689 6.12747 11.2643 6.13789 11.4344 6.2192C12.1529 6.56241 12.7786 7.07301 13.2589 7.70812C13.7392 8.34323 14.0601 9.08431 14.1947 9.86913C14.3293 10.654 14.2736 11.4596 14.0323 12.2185C13.791 12.9773 13.3712 13.6672 12.8081 14.2302L8.54191 18.4964C8.08196 18.9684 7.53286 19.3443 6.92647 19.6024C6.32007 19.8605 5.66845 19.9956 5.00943 19.9999C4.35041 20.0042 3.6971 19.8775 3.08741 19.6273C2.47773 19.377 1.92381 19.0082 1.4578 18.5422C0.991789 18.0762 0.622966 17.5223 0.372734 16.9126C0.122501 16.3029 -0.00415848 15.6496 0.000104119 14.9906C0.00436672 14.3315 0.139467 13.6799 0.397565 13.0735C0.655663 12.4671 1.03162 11.918 1.50362 11.4581L3.16933 9.79238C3.23443 9.72252 3.31293 9.66649 3.40015 9.62763C3.48737 9.58876 3.58152 9.56787 3.67699 9.56618C3.77246 9.5645 3.86729 9.58206 3.95583 9.61782C4.04437 9.65358 4.12479 9.70681 4.19231 9.77433C4.25983 9.84185 4.31306 9.92227 4.34882 10.0108C4.38458 10.0993 4.40214 10.1942 4.40046 10.2896C4.39877 10.3851 4.37788 10.4793 4.33902 10.5665C4.30015 10.6537 4.24412 10.7322 4.17426 10.7973L2.50855 12.463C2.17838 12.7932 1.91647 13.1852 1.73778 13.6166C1.55909 14.0479 1.46712 14.5103 1.46712 14.9772C1.46712 15.4442 1.55909 15.9065 1.73778 16.3379C1.91647 16.7693 2.17838 17.1613 2.50855 17.4915C2.83872 17.8216 3.23069 18.0835 3.66208 18.2622C4.09347 18.4409 4.55583 18.5329 5.02276 18.5329C5.4897 18.5329 5.95206 18.4409 6.38345 18.2622C6.81484 18.0835 7.20681 17.8216 7.53698 17.4915L11.8032 13.2253C12.2057 12.8231 12.5058 12.3303 12.6782 11.7881C12.8507 11.2459 12.8906 10.6703 12.7944 10.1095C12.6983 9.54875 12.469 9.01925 12.1258 8.5655C11.7825 8.11175 11.3354 7.747 10.822 7.5019C10.7377 7.4617 10.6621 7.40528 10.5996 7.33588C10.5371 7.26647 10.4889 7.18544 10.4578 7.0974C10.4266 7.00936 10.4131 6.91605 10.418 6.82278C10.4229 6.72952 10.4461 6.63814 10.4863 6.55386Z" fill="#B9B9B9" />
                                                    </svg>

                                                    <span className='font-medium text-[16px] lg:text-[18px] text-[#B9B9B9] whitespace-nowrap overflow-hidden text-ellipsis lg:max-w-[300px]'>
                                                        {referralsData?.data.referral_url || 'Не указано'}
                                                    </span>

                                                </div>


                                                <Button className='gap-[6px] lg:gap-[8px] text-[16px] lg:text-[18px] font-medium h-[48px] lg:h-[56px] w-full lg:w-[190px] rounded-[12px] lg:rounded-[14px]' isReversed buttonText='Скопировать' icon={<DocumentsIcon />} clickHandler={() => {
                                                    copyToClipboard(referralsData?.data.referral_url || 'Не указано')
                                                    setIsLinkCopied(true)
                                                }} />
                                            </div>
                                        </div>
                                    )
                                }

                                <div className='flex flex-col justify-center p-[16px] bg-[#FFFFFF] shadow-[0px_0px_25.8px_0px_rgba(15,15,43,0.05)] rounded-[16px] lg:rounded-[21px] lg:order-none order-[-1]'>
                                    {isMobileDevice() && (
                                        <div className='flex gap-[8px]'>
                                            <span className='text-[18px] lg:text-[24px] text-[#33331F] font-medium'>
                                                Реферальная ссылка
                                            </span>

                                            <span className='flex items-center justify-center h-[22px] px-[6px] rounded-[12px] bg-[#1D7BFF] text-[15px] text-[#FFFFFF]'>
                                                {getReferralsValue(referralsData?.data.referrals || 0)}
                                            </span>
                                        </div>
                                    )}

                                    <img
                                        src={`data:image/png;base64,${referralsData?.data.qr ?? ''}`}
                                        className="w-full h-[318px] lg:w-[117px] lg:h-[112px]  object-contain"
                                        alt="QR код для сканирования"
                                    />

                                    {isMobileDevice() && (
                                        <div className='flex flex-col gap-[12px] w-full'>
                                            <div className='flex items-center px-[14px] lg:px-[15px] h-[48px] gap-[8px] w-full 
                    rounded-[14px] bg-[#F9F9F9] border border-[#B9B9B933] 
                    min-w-0  overflow-hidden'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.4915 2.50855C17.1613 2.17832 16.7694 1.91636 16.338 1.73764C15.9066 1.55892 15.4442 1.46693 14.9772 1.46693C14.5103 1.46693 14.0479 1.55892 13.6165 1.73764C13.1851 1.91636 12.7932 2.17832 12.463 2.50855L8.19682 6.77475C7.79434 7.17688 7.49424 7.66973 7.32175 8.2119C7.14926 8.75407 7.10941 9.32972 7.20555 9.89048C7.30169 10.4512 7.53101 10.9807 7.87425 11.4345C8.21748 11.8883 8.6646 12.253 9.17805 12.4981C9.34235 12.5828 9.46723 12.7281 9.52621 12.9033C9.58519 13.0784 9.57363 13.2697 9.49399 13.4365C9.41435 13.6033 9.27288 13.7325 9.09958 13.7968C8.92627 13.8611 8.73475 13.8553 8.56561 13.7808C7.8471 13.4376 7.22142 12.927 6.74111 12.2919C6.2608 11.6568 5.93988 10.9157 5.8053 10.1309C5.67072 9.34604 5.72641 8.54039 5.96768 7.78154C6.20895 7.0227 6.62877 6.33281 7.19189 5.76982L11.4581 1.50362C11.918 1.03162 12.4671 0.655663 13.0735 0.397565C13.6799 0.139467 14.3315 0.00436672 14.9906 0.000104119C15.6496 -0.00415848 16.3029 0.122501 16.9126 0.372734C17.5223 0.622966 18.0762 0.991789 18.5422 1.4578C19.0082 1.92381 19.377 2.47773 19.6273 3.08741C19.8775 3.6971 20.0042 4.35041 19.9999 5.00943C19.9956 5.66845 19.8605 6.32007 19.6024 6.92647C19.3443 7.53286 18.9684 8.08196 18.4964 8.54191L16.8307 10.2076C16.7656 10.2775 16.6871 10.3335 16.5999 10.3724C16.5126 10.4112 16.4185 10.4321 16.323 10.4338C16.2275 10.4355 16.1327 10.4179 16.0442 10.3822C15.9556 10.3464 15.8752 10.2932 15.8077 10.2257C15.7402 10.1582 15.6869 10.0777 15.6512 9.98919C15.6154 9.90065 15.5979 9.80582 15.5995 9.71035C15.6012 9.61488 15.6221 9.52073 15.661 9.43351C15.6998 9.34629 15.7559 9.26779 15.8257 9.20269L17.4915 7.53698C17.8217 7.20684 18.0836 6.81488 18.2624 6.38348C18.4411 5.95209 18.5331 5.48971 18.5331 5.02276C18.5331 4.55581 18.4411 4.09344 18.2624 3.66204C18.0836 3.23065 17.8217 2.83869 17.4915 2.50855ZM10.4863 6.55386C10.5677 6.38378 10.7133 6.25299 10.8911 6.19023C11.0689 6.12747 11.2643 6.13789 11.4344 6.2192C12.1529 6.56241 12.7786 7.07301 13.2589 7.70812C13.7392 8.34323 14.0601 9.08431 14.1947 9.86913C14.3293 10.654 14.2736 11.4596 14.0323 12.2185C13.791 12.9773 13.3712 13.6672 12.8081 14.2302L8.54191 18.4964C8.08196 18.9684 7.53286 19.3443 6.92647 19.6024C6.32007 19.8605 5.66845 19.9956 5.00943 19.9999C4.35041 20.0042 3.6971 19.8775 3.08741 19.6273C2.47773 19.377 1.92381 19.0082 1.4578 18.5422C0.991789 18.0762 0.622966 17.5223 0.372734 16.9126C0.122501 16.3029 -0.00415848 15.6496 0.000104119 14.9906C0.00436672 14.3315 0.139467 13.6799 0.397565 13.0735C0.655663 12.4671 1.03162 11.918 1.50362 11.4581L3.16933 9.79238C3.23443 9.72252 3.31293 9.66649 3.40015 9.62763C3.48737 9.58876 3.58152 9.56787 3.67699 9.56618C3.77246 9.5645 3.86729 9.58206 3.95583 9.61782C4.04437 9.65358 4.12479 9.70681 4.19231 9.77433C4.25983 9.84185 4.31306 9.92227 4.34882 10.0108C4.38458 10.0993 4.40214 10.1942 4.40046 10.2896C4.39877 10.3851 4.37788 10.4793 4.33902 10.5665C4.30015 10.6537 4.24412 10.7322 4.17426 10.7973L2.50855 12.463C2.17838 12.7932 1.91647 13.1852 1.73778 13.6166C1.55909 14.0479 1.46712 14.5103 1.46712 14.9772C1.46712 15.4442 1.55909 15.9065 1.73778 16.3379C1.91647 16.7693 2.17838 17.1613 2.50855 17.4915C2.83872 17.8216 3.23069 18.0835 3.66208 18.2622C4.09347 18.4409 4.55583 18.5329 5.02276 18.5329C5.4897 18.5329 5.95206 18.4409 6.38345 18.2622C6.81484 18.0835 7.20681 17.8216 7.53698 17.4915L11.8032 13.2253C12.2057 12.8231 12.5058 12.3303 12.6782 11.7881C12.8507 11.2459 12.8906 10.6703 12.7944 10.1095C12.6983 9.54875 12.469 9.01925 12.1258 8.5655C11.7825 8.11175 11.3354 7.747 10.822 7.5019C10.7377 7.4617 10.6621 7.40528 10.5996 7.33588C10.5371 7.26647 10.4889 7.18544 10.4578 7.0974C10.4266 7.00936 10.4131 6.91605 10.418 6.82278C10.4229 6.72952 10.4461 6.63814 10.4863 6.55386Z" fill="#B9B9B9" />
                                                </svg>

                                                <span className='font-medium text-[16px] lg:text-[18px] text-[#B9B9B9] whitespace-nowrap overflow-hidden text-ellipsis lg:max-w-[300px]'>
                                                    {referralsData?.data.referral_url || 'Не указано'}
                                                </span>

                                            </div>


                                            <Button className='gap-[6px] lg:gap-[8px] text-[16px] lg:text-[18px] font-medium h-[48px] lg:h-[56px] w-full lg:w-[190px] rounded-[12px] lg:rounded-[14px]' isReversed buttonText='Скопировать' icon={<DocumentsIcon />} clickHandler={() => {
                                                copyToClipboard(referralsData?.data.referral_url || 'Не указано')
                                                setIsLinkCopied(true)
                                            }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col p-[20px] lg:p-[24px] bg-[#FFFFFF] shadow-[0px_0px_25.8px_0px_rgba(15,15,43,0.05)] rounded-[20px] grow'>
                            <div className='flex items-center justify-between'>
                                <span className='text-[18px] lg:text-[24px] text-[#33331F] font-medium'>
                                    История транзакций
                                </span>

                                {
                                    !isMobileDevice() && (
                                        <button type='button' className='w-[250px] h-[48px] rounded-[12px] border border-[#F1F1F1] bg-[#FFFFFF] font-medium text-[16px] gap-[8px] text-[#333333] cursor-pointer flex items-center justify-center' disabled={isDownloadingSheet} onClick={handleDownloadTransactions}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M5.625 2H9C9.86195 2 10.6884 2.34266 11.2979 2.95215C11.9073 3.56164 12.25 4.38805 12.25 5.25V7.125C12.25 7.75489 12.4999 8.35929 12.9453 8.80469C13.3907 9.25009 13.9951 9.5 14.625 9.5H16.5C17.362 9.5 18.1884 9.84266 18.7979 10.4521C19.4073 11.0616 19.75 11.888 19.75 12.75V20.625C19.75 21.3839 19.1339 22 18.375 22H5.625C4.86614 22 4.25 21.3839 4.25 20.625V3.375C4.25 2.61597 4.86532 2 5.625 2Z" fill="#333333" stroke="#333333" />
                                                <path d="M12.9707 1.81598C13.7972 2.76894 14.2515 3.98853 14.2497 5.24998V7.12498C14.2497 7.33198 14.4177 7.49998 14.6247 7.49998H16.4997C17.7612 7.49823 18.9807 7.95246 19.9337 8.77898C19.4937 7.10569 18.6172 5.57928 17.3938 4.35587C16.1704 3.13245 14.644 2.25594 12.9707 1.81598Z" fill="#333333" />
                                            </svg>
                                            {isDownloadingSheet ? 'Экспортируется' : 'Экспортировать в .xlsx'}
                                        </button>
                                    )
                                }
                            </div>

                            <div className='flex items-center gap-[32px] mt-[24px] overflow-x-auto scrollbar-hide'>
                                {
                                    filters.map((filter) => (
                                        <button
                                            key={filter.id}
                                            onClick={() => setSelectedFilter(filter.value)}
                                            type='button'
                                            className={`outline-none border-none bg-none font-medium text-[16px] lg:text-[18px] text-[${selectedFilter === filter.value ? '#ED0028' : '#D7D7D7'}] underline decoration-[${selectedFilter === filter.value && '#ED0028'}] pb-[12px] underline-offset-[12px] cursor-pointer`}
                                        >
                                            {filter.name}
                                        </button>
                                    ))
                                }
                            </div>

                            <div className='mt-[24px] lg:mt-[32px] flex flex-col gap-[16px] lg:gap-[24px] max-h-[436px] lg:max-h-[420px] overflow-y-auto lg:pr-[16px]'>
                                {
                                    filteredTransactions && filteredTransactions.length > 0 ? filteredTransactions.map((transaction) => (
                                        <div key={transaction.id} className='flex items-start justify-between gap-[12px] border-b border-b-[#E7E7E7B2] pb-[24px]'>
                                            <div className='min-w-0 flex-1'>
                                                <div className='flex gap-[10px] lg:gap-[16px]'>
                                                    <TransactionIcon transaction={transaction} />

                                                    <div className='flex min-w-0 flex-col gap-[4px] lg:gap-[6px]'>
                                                        <span className='font-medium text-[16px] lg:text-[20px] leading-[1.3] text-[#33331F]'>
                                                            {getTransactionPresentation(transaction).title}
                                                        </span>

                                                        {getTransactionPresentation(transaction).description && (
                                                            <span className='text-[14px] lg:text-[16px] leading-[1.35] text-[#777777] break-words'>
                                                                {getTransactionPresentation(transaction).description}
                                                            </span>
                                                        )}

                                                        <span className='text-[13px] lg:text-[16px] text-[#B9B9B9]'>
                                                            {new Date(transaction.created_at).toLocaleDateString('ru-RU', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                timeZone: 'UTC'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className='flex shrink-0 flex-col items-end gap-[2px] lg:gap-[4px]'>
                                                <span className={`font-semibold text-[18px] lg:text-[24px] whitespace-nowrap ${transaction.type === 'plus' ? 'text-[#21A366]' : 'text-[#ED0028]'}`}>
                                                    {transaction.type === 'plus' ? `+${transaction.amount.toLocaleString('ru-RU')} ₽` : `-${transaction.amount.toLocaleString('ru-RU')} ₽`}
                                                </span>

                                                <span className='text-[13px] lg:text-[18px] text-[#B9B9B9] order-[-1] lg:order-none'>
                                                    Сумма
                                                </span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className='flex flex-col items-center justify-center gap-[16px] py-[40px]'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM7.75736 7.75736C8.1499 7.36482 8.78206 7.36482 9.1746 7.75736L12 10.5821L14.8254 7.75736C15.2189 7.36482 15.8511 7.36482 16.2436 7.75736C16.6362 8.14991 16.6362 8.78207 16.2436 9.17461L12.7071 12.7071C12.3166 13.0976 11.6834 13.0976 11.2929 12.7071L7.75736 9.17461C7.36482 8.78207 7.36482 8.14991 7.75736 7.75736Z" fill="#B9B9B9" />
                                            </svg>
                                            <span className='text-[18px] text-[#B9B9B9]'>
                                                Транзакции не найдены
                                            </span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div className='flex flex-col p-[24px] bg-[#FFFFFF] shadow-[0px_0px_25.8px_0px_rgba(15,15,43,0.05)] rounded-[20px] grow'>
                            <div className='flex items-center justify-between'>
                                <span className='text-[18px] lg:text-[24px] text-[#33331F] font-medium'>
                                    На кого таможня
                                </span>

                                {isMobileDevice() ? <Button className='w-[56px] h-[44px] rounded-[12px] font-medium' buttonText='' icon={<MobilePlusIcon />} clickHandler={() => setIsNewClientPopup(true)} /> : <Button className='w-[176px] h-[48px] rounded-[12px] font-medium text-[16px]' buttonText='Добавить персону' clickHandler={() => setIsNewClientPopup(true)} />}
                            </div>

                            {
                                clients && clients.data.length > 0 ? (
                                    <div className={`mt-[24px] grid grid-cols-1 lg:grid-cols-2 gap-[12px] lg:gap-[24px] overflow-y-auto pr-[8px] lg:pr-[16px]  ${!isClientsFullHeight ? 'max-h-[544px] lg:max-h-[642px]' : 'h-auto'}`}>
                                        {clients.data.map((client) => (
                                            <div key={client.id} className='p-[20px] lg:p-[24px] rounded-[24px] border border-[#F1F1F1] bg-[#FDFDFD] h-full lg:min-h-[308px] flex flex-col justify-between'>
                                                <div className='flex flex-col'>
                                                    <span className='font-medium text-[16px] lg:text-[20px] text-[#33331F]'>
                                                        {client.last_name} {client.first_name} {client.patronymic_name}
                                                    </span>

                                                    <div className='mt-[20px] flex items-center gap-[32px] lg:gap-[48px]'>
                                                        <div className='flex flex-col lg:gap-[8px]'>
                                                            <span className='text-[14px] lg:text-[16px] text-[#B9B9B9]'>
                                                                Дата рождения
                                                            </span>
                                                            <span className='text-[16px] lg:text-[18px] text-[#333333]'>
                                                                {
                                                                    client.birthday
                                                                        ? client.birthday.split('T')[0].split('-').reverse().join('.')
                                                                        : 'Не указано'
                                                                }
                                                            </span>
                                                        </div>

                                                        <div className='flex flex-col gap-[8px]'>
                                                            <span className='text-[14px] lg:text-[16px] text-[#B9B9B9]'>
                                                                Паспорт
                                                            </span>
                                                            <span className='text-[16px] lg:text-[18px] text-[#333333]'>
                                                                {client.passport_series && client.passport_number ? `${client.passport_series} ${client.passport_number}` : 'Не указано'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className='flex flex-col gap-[8px] mt-[16px] lg:mt-[24px]'>
                                                        <span className='text-[14px] lg:text-[16px] text-[#B9B9B9]'>
                                                            Прописка
                                                        </span>
                                                        <span className='text-[16px] lg:text-[18px] text-[#333333]'>
                                                            {client.full_address || 'Не указано'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className='flex items-center gap-[8px] mt-[20px] lg:mt-[24px]'>
                                                    <button type='button' className='w-[56px] h-[48px] cursor-pointer outline-none border border-[#F1F1F1] rounded-[12px] bg-[#FDFDFD] flex items-center justify-center' onClick={() => setSelectedChangeClient(client)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M18.8057 8.19855L7.00977 19.9954C6.45176 20.5537 5.76328 20.9643 5.00684 21.1898L2.32129 21.9896C2.27811 22.0024 2.23215 22.0035 2.18848 21.9925C2.14488 21.9814 2.10505 21.9589 2.07324 21.9271C2.04144 21.8953 2.01889 21.8554 2.00781 21.8118C1.99676 21.7682 1.99789 21.7222 2.01074 21.679L2.81055 18.9935C3.03601 18.237 3.44659 17.5486 4.00488 16.9905L15.8008 5.19366L18.8057 8.19855ZM19.875 2.00031C20.4385 2.00031 20.9794 2.22394 21.3779 2.62238C21.7763 3.02087 22 3.56181 22 4.12531C21.9999 4.68861 21.7761 5.22885 21.3779 5.62726L20.5742 6.43097L17.5693 3.42609L18.373 2.62238C18.7715 2.22415 19.3117 2.00037 19.875 2.00031Z" fill="#333333" stroke="#333333" />
                                                        </svg>
                                                    </button>

                                                    <button type='button' className='w-[56px] h-[48px] cursor-pointer outline-none border border-[#F1F1F1] rounded-[12px] bg-[#FDFDFD] flex items-center justify-center' onClick={() => handleDeleteClient(client.id)} disabled={isDeleteClientProcessing}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M10.3291 1.94336C11.4429 1.90771 12.558 1.90771 13.6719 1.94336C15.0381 1.98689 16.0828 3.12674 16.083 4.47754V5.08496L16.4619 5.12012C17.7497 5.23788 19.0324 5.40744 20.3066 5.62793C20.3498 5.6354 20.3917 5.65042 20.4287 5.67383C20.4656 5.69719 20.4973 5.72801 20.5225 5.76367C20.5477 5.79945 20.5656 5.84011 20.5752 5.88281C20.5848 5.92549 20.5856 5.96959 20.5781 6.0127C20.5707 6.05579 20.5546 6.09682 20.5312 6.13379C20.5079 6.17071 20.4781 6.20332 20.4424 6.22852C20.4066 6.25372 20.3659 6.27164 20.3232 6.28125C20.2806 6.29084 20.2364 6.29161 20.1934 6.28418H20.1904L19.9814 6.24902L19.5322 6.17383L19.498 6.62793L18.4922 19.6982C18.4422 20.3471 18.1493 20.9533 17.6719 21.3955C17.1944 21.8376 16.5677 22.083 15.917 22.083H8.08398C7.43327 22.083 6.80657 21.8376 6.3291 21.3955C5.85165 20.9533 5.55874 20.3471 5.50879 19.6982L4.50293 6.62793L4.46777 6.17383L4.01855 6.24902L3.80957 6.28418H3.80664C3.76358 6.29161 3.7194 6.29084 3.67676 6.28125C3.63408 6.27164 3.59337 6.25371 3.55762 6.22852C3.48546 6.17759 3.43695 6.09972 3.42188 6.0127C3.40682 5.92561 3.42663 5.83591 3.47754 5.76367C3.52847 5.6915 3.60632 5.64301 3.69336 5.62793C4.96755 5.40718 6.25026 5.23762 7.53809 5.12012L7.91699 5.08496V4.47754C7.9172 3.12695 8.96275 1.98691 10.3291 1.94336ZM9.21387 7.83398C9.06072 7.83991 8.90973 7.87537 8.77051 7.93945C8.63141 8.00353 8.50637 8.09464 8.40234 8.20703C8.29823 8.31952 8.21721 8.45193 8.16406 8.5957C8.11104 8.73932 8.08687 8.89194 8.09277 9.04492L8.43945 18.0449C8.45142 18.3541 8.58638 18.6463 8.81348 18.8564C8.92585 18.9604 9.05761 19.0417 9.20117 19.0947C9.34474 19.1477 9.49745 19.1719 9.65039 19.166C9.80349 19.1601 9.95457 19.1236 10.0938 19.0596C10.2328 18.9955 10.358 18.9043 10.4619 18.792C10.5658 18.6796 10.6471 18.5479 10.7002 18.4043C10.7532 18.2607 10.7774 18.108 10.7715 17.9551L10.4258 8.95508C10.4199 8.80191 10.3834 8.65096 10.3193 8.51172C10.2553 8.37257 10.1642 8.24762 10.0518 8.14355C9.93936 8.03953 9.80769 7.95842 9.66406 7.90527C9.52029 7.85213 9.36704 7.82806 9.21387 7.83398ZM14.7861 7.80859C14.6297 7.80254 14.4735 7.82826 14.3271 7.88379C14.1808 7.93932 14.0466 8.02358 13.9336 8.13184C13.8207 8.24005 13.7307 8.36998 13.6689 8.51367C13.6225 8.62168 13.5933 8.73607 13.5811 8.85254L13.5742 8.95508L13.2275 17.9551C13.2156 18.2643 13.3269 18.5658 13.5371 18.793C13.7473 19.0201 14.0394 19.154 14.3486 19.166C14.6579 19.178 14.9593 19.0667 15.1865 18.8564C15.3853 18.6725 15.513 18.4261 15.5498 18.1602L15.5605 18.0449L15.9053 9.04492L15.9043 9.04395C15.9133 8.89285 15.8945 8.74103 15.8457 8.59766C15.7952 8.44956 15.7146 8.31293 15.6104 8.19629C15.5062 8.07986 15.3796 7.98555 15.2383 7.91895C15.0966 7.85226 14.9426 7.81465 14.7861 7.80859ZM13.6504 2.60938C12.5508 2.57421 11.4502 2.57421 10.3506 2.60938C9.36178 2.6409 8.58322 3.46812 8.58301 4.47754V5.0332L9.02539 5.00684C11.0066 4.88651 12.9934 4.88652 14.9746 5.00684L15.417 5.0332V4.47754C15.4168 3.46807 14.6372 2.64088 13.6504 2.60938Z" fill="#333333" stroke="#333333" stroke-width="0.833333" />
                                                        </svg>
                                                    </button>

                                                    {!isMobileDevice() && (
                                                        <button type='button' className='w-[56px] h-[48px] cursor-pointer outline-none border border-[#F1F1F1] rounded-[12px] bg-[#FDFDFD] flex items-center justify-center' onClick={() => setSelectedInfoClient(client)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                <path d="M12 2.75C17.1089 2.75 21.25 6.89114 21.25 12C21.25 17.1089 17.1089 21.25 12 21.25C6.89114 21.25 2.75 17.1089 2.75 12C2.75 6.89114 6.89114 2.75 12 2.75ZM13.5674 12.3857C13.982 10.7285 12.2606 9.34645 10.7324 10.1104L10.7256 10.1143L10.7197 10.1172L10.6787 10.1396C10.5377 10.2077 10.4101 10.3009 10.3037 10.416C10.1892 10.5399 10.1006 10.6859 10.0439 10.8447C9.98737 11.0035 9.96339 11.1726 9.97363 11.3408C9.98393 11.509 10.0281 11.6735 10.1035 11.8242C10.179 11.9749 10.2846 12.1088 10.4131 12.2178C10.5417 12.3268 10.6914 12.4092 10.8525 12.459C10.8895 12.4704 10.9271 12.4794 10.9648 12.4873L10.4326 14.6143C10.0179 16.272 11.7398 17.6533 13.2686 16.8896L13.2861 16.8799L13.3262 16.8584L13.3301 16.8555C13.6095 16.698 13.8182 16.4394 13.9121 16.1328C14.006 15.8262 13.9783 15.4949 13.835 15.208C13.6915 14.9211 13.4433 14.6998 13.1416 14.5908C13.1031 14.5769 13.0638 14.5647 13.0244 14.5547L13.5674 12.3857ZM12 7C11.6685 7 11.3506 7.13179 11.1162 7.36621C10.8818 7.60063 10.75 7.91848 10.75 8.25C10.75 8.58152 10.8818 8.89937 11.1162 9.13379C11.3506 9.36821 11.6685 9.5 12 9.5C12.3315 9.5 12.6494 9.36821 12.8838 9.13379C13.1182 8.89937 13.25 8.58152 13.25 8.25C13.25 7.91848 13.1182 7.60063 12.8838 7.36621C12.6494 7.13179 12.3315 7 12 7Z" fill="#333333" stroke="#333333" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center w-full justify-center gap-[16px] py-[40px]'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM7.75736 7.75736C8.1499 7.36482 8.78206 7.36482 9.1746 7.75736L12 10.5821L14.8254 7.75736C15.2189 7.36482 15.8511 7.36482 16.2436 7.75736C16.6362 8.14991 16.6362 8.78207 16.2436 9.17461L12.7071 12.7071C12.3166 13.0976 11.6834 13.0976 11.2929 12.7071L7.75736 9.17461C7.36482 8.78207 7.36482 8.14991 7.75736 7.75736Z" fill="#B9B9B9" />
                                        </svg>
                                        <span className='text-[18px] text-[#B9B9B9]'>
                                            Клиенты не найдены
                                        </span>
                                    </div>
                                )
                            }

                            {(clients && clients.data.length > 0 && !isClientsFullHeight) && (
                                <button type='button' className='w-full h-[48px] rounded-[10px] border border-[#F1F1F1] bg-[#FFFFFF] font-medium text-[16px] text-[#333333] cursor-pointer mt-[24px]' onClick={() => setIsClientsFullHeight(true)}>
                                    Показать еще
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Profile

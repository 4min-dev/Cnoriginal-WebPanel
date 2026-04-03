import React, { useState, useRef, useCallback, type SetStateAction, type Dispatch } from 'react'
import * as XLSX from 'xlsx'
import type { User } from '../../../types/User'
import type { NewOrder } from '../../../types/NewOrder'

type UploadedFile = {
    id: string
    name: string
    size: string
    status: 'success' | 'uploading' | 'error'
    file?: File
}

type Client = {
    id: string
} & User

type CreateOrderError = {
    title: string
    description: string
}

const NewOrderPopup: React.FC<{
    onClose: () => void
    handleCreateOrder: (order: NewOrder & { tables: File[], imageFile?: File }) => Promise<void>
    userClients?: Client[]
    setError: Dispatch<SetStateAction<{ title: string, description: string }>>
}> = ({ onClose, handleCreateOrder, userClients = [], setError }) => {

    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [trackingNumber, setTrackingNumber] = useState('')
    const [description, setDescription] = useState('')
    const [productUrl, setProductUrl] = useState('')
    const [costPerGood, setCostPerGood] = useState<number | ''>('')
    const [count, setCount] = useState<number | ''>('')

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const thumbnailInputRef = useRef<HTMLInputElement>(null)

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    const validateTableFile = async (file: File): Promise<CreateOrderError | null> => {
        const allowedExtensions = ['.xlsx', '.xls']
        const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))

        if (!allowedExtensions.includes(ext)) {
            return {
                title: 'Неверный формат файла',
                description: 'Файл не распознан. Поддерживаются только .xlsx или .xls'
            }
        }

        if (file.size === 0) {
            return {
                title: 'Файл пустой',
                description: 'Файл не содержит данных.'
            }
        }

        if (file.size > 50 * 1024 * 1024) {
            return {
                title: 'Слишком большой файл',
                description: 'Файл слишком большой. Разделите его на несколько и попробуйте снова.'
            }
        }

        try {
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data, {
                type: 'array',
                cellFormula: false,
                cellHTML: false,
                cellStyles: false
            })

            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                return {
                    title: 'Файл пустой',
                    description: 'В файле нет ни одного листа.'
                }
            }

            let hasData = false

            for (const sheetName of workbook.SheetNames) {
                const sheet = workbook.Sheets[sheetName]
                const jsonData = XLSX.utils.sheet_to_json(sheet, {
                    header: 1,
                    defval: null,
                    blankrows: false
                })

                if (jsonData && jsonData.length > 0) {
                    const hasRealData = jsonData.some((row) =>
                        Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && cell !== '')
                    )

                    if (hasRealData) {
                        hasData = true
                        break
                    }
                }
            }

            if (!hasData) {
                return {
                    title: 'Файл пустой',
                    description: 'В таблице нет данных (только заголовки или пустые строки). Добавьте информацию и загрузите снова.'
                }
            }
        } catch (readError) {
            console.error('Ошибка чтения Excel-файла:', readError)
            return {
                title: 'Неверный файл',
                description: 'Не удалось прочитать содержимое файла. Возможно, файл повреждён.'
            }
        }

        return null
    }

    const handleFileSelect = async (files: FileList | File[]) => {
        const fileList = Array.from(files)
        if (fileList.length === 0) return

        const newFile = fileList[0]

        const newUploadedFile: UploadedFile = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            name: newFile.name,
            size: formatFileSize(newFile.size),
            status: 'uploading',
            file: newFile
        }

        setUploadedFile(newUploadedFile)

        const error = await validateTableFile(newFile)

        if (error) {
            setUploadedFile({
                ...newUploadedFile,
                status: 'error'
            })
            setError(error)
        } else {
            setUploadedFile({
                ...newUploadedFile,
                status: 'success'
            })
        }
    }

    const removeFile = () => {
        setUploadedFile(null)
    }

    const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnailFile(e.target.files[0])
        }
    }

    const handleSubmit = async () => {
        if (!selectedClient?.id) {
            alert('Пожалуйста, выберите клиента')
            return
        }

        if (!uploadedFile?.file) {
            setError({
                title: 'Отсутствует таблица',
                description: 'Пожалуйста, загрузите таблицу с данными'
            })
            return
        }

        if (uploadedFile.status === 'error') {
            setError({
                title: 'Ошибка в файле',
                description: 'Исправьте ошибки в загруженном файле перед созданием заказа'
            })
            return
        }

        setIsSubmitting(true)
        setError({ title: '', description: '' })

        const orderData: NewOrder & { tables: File[], imageFile?: File } = {
            tracking_number: trackingNumber.trim(),
            description: description.trim(),
            product_url: productUrl.trim(),
            cost_per_good: typeof costPerGood === 'number' ? costPerGood : 0,
            count: typeof count === 'number' ? count : 0,
            image_url: '',
            client_id: selectedClient.id,
            tables: [uploadedFile.file],
            imageFile: thumbnailFile || undefined
        }

        try {
            await handleCreateOrder(orderData)
            onClose()
        } catch (err: unknown) {
            console.error('Ошибка при создании заказа:', err)

            let errorTitle = 'Ошибка создания заказа'
            let errorDescription = 'Произошла неизвестная ошибка. Попробуйте снова.'

            if (err && typeof err === 'object') {
                const errorObj = err as {
                    data?: {
                        message?: string
                        code?: string
                        error?: string
                        detail?: { msg?: string, message?: string }[]
                    }
                    message?: string
                    code?: string
                    error?: string
                }

                if (errorObj.data && Array.isArray(errorObj.data.detail) && errorObj.data.detail.length > 0) {
                    errorTitle = 'Ошибка в данных'
                    errorDescription = errorObj.data.detail[0].msg || errorObj.data.detail[0].message || String(errorObj.data.detail[0])
                } else if (errorObj.data?.message) {
                    errorTitle = 'Ошибка'
                    errorDescription = errorObj.data.message
                } else if (errorObj.message) {
                    errorDescription = errorObj.message
                }

                if (errorObj.data?.code === 'TABLE_READ_ERROR' ||
                    errorObj.data?.error?.includes('таблиц') ||
                    errorDescription.toLowerCase().includes('таблиц')) {
                    errorTitle = 'Ошибка чтения данных'
                    errorDescription = 'Не удалось обработать таблицу. Проверьте формат ячеек и названия колонок.'
                }
            } else if (typeof err === 'string') {
                errorDescription = err
            }

            setError({ title: errorTitle, description: errorDescription })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files)
        }
    }, [])

    function getStatusIcon(status: 'success' | 'uploading' | 'error') {
        switch (status) {
            case 'success':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M9 1.5H5.625C4.589 1.5 3.75 2.34 3.75 3.375V20.625C3.75 21.66 4.59 22.5 5.625 22.5H18.375C19.41 22.5 20.25 21.66 20.25 20.625V12.75C20.25 11.7554 19.8549 10.8016 19.1517 10.0983C18.4484 9.39509 17.4946 9 16.5 9H14.625C14.1277 9 13.6508 8.80246 13.2992 8.45083C12.9475 8.0992 12.75 7.62228 12.75 7.125V5.25C12.75 4.25544 12.3549 3.30161 11.6517 2.59835C10.9484 1.89509 9.99456 1.5 9 1.5ZM15.61 12.436C15.67 12.3561 15.7134 12.2649 15.7377 12.1679C15.762 12.071 15.7666 11.9701 15.7514 11.8714C15.7361 11.7726 15.7012 11.6778 15.6489 11.5927C15.5965 11.5076 15.5276 11.4338 15.4463 11.3757C15.3649 11.3175 15.2728 11.2762 15.1753 11.2542C15.0778 11.2322 14.9769 11.2299 14.8785 11.2475C14.7801 11.265 14.6862 11.3021 14.6023 11.3564C14.5184 11.4108 14.4462 11.4813 14.39 11.564L11.154 16.094L9.53 14.47C9.38783 14.3375 9.19978 14.2654 9.00548 14.2688C8.81118 14.2723 8.62579 14.351 8.48838 14.4884C8.35097 14.6258 8.27225 14.8112 8.26882 15.0055C8.2654 15.1998 8.33752 15.3878 8.47 15.53L10.72 17.78C10.797 17.8569 10.8898 17.9162 10.992 17.9536C11.0942 17.9911 11.2033 18.0059 11.3118 17.9969C11.4202 17.988 11.5255 17.9555 11.6201 17.9019C11.7148 17.8482 11.7967 17.7745 11.86 17.686L15.61 12.436Z" fill="#47D40A" />
                        <path d="M12.9709 1.81592C13.7975 2.76888 14.2517 3.98846 14.2499 5.24992V7.12492C14.2499 7.33192 14.4179 7.49992 14.6249 7.49992H16.4999C17.7614 7.49817 18.981 7.9524 19.9339 8.77892C19.494 7.10563 18.6175 5.57922 17.3941 4.3558C16.1706 3.13239 14.6442 2.25588 12.9709 1.81592Z" fill="#47D40A" />
                    </svg>
                )
            case 'uploading':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.625 1.5H9C9.99456 1.5 10.9484 1.89509 11.6517 2.59835C12.3549 3.30161 12.75 4.25544 12.75 5.25V7.125C12.75 8.161 13.59 9 14.625 9H16.5C17.4946 9 18.4484 9.39509 19.1517 10.0983C19.8549 10.8016 20.25 11.7554 20.25 12.75V20.625C20.25 21.66 19.41 22.5 18.375 22.5H5.625C5.12772 22.5 4.65081 22.3025 4.29917 21.9508C3.94754 21.5992 3.75 21.1223 3.75 20.625V3.375C3.75 2.339 4.59 1.5 5.625 1.5ZM12.53 11.47C12.3894 11.3295 12.1988 11.2507 12 11.2507C11.8012 11.2507 11.6106 11.3295 11.47 11.47L8.47 14.47C8.39631 14.5387 8.33721 14.6215 8.29622 14.7135C8.25523 14.8055 8.23318 14.9048 8.23141 15.0055C8.22963 15.1062 8.24816 15.2062 8.28588 15.2996C8.3236 15.393 8.37974 15.4778 8.45096 15.549C8.52218 15.6203 8.60701 15.6764 8.7004 15.7141C8.79379 15.7518 8.89382 15.7704 8.99452 15.7686C9.09522 17.9911 9.2033 18.0059 9.3118 17.9969C9.4202 17.988 9.5255 17.9555 9.6201 17.9019C9.7148 17.8482 9.7967 17.7745 9.86 17.686L12.53 11.47Z" fill="#FFC31D" />
                        <path d="M14.2499 5.24992C14.2517 3.98846 13.7975 2.76888 12.9709 1.81592C14.6442 2.25588 16.1706 3.13239 17.3941 4.3558C18.6175 5.57922 19.494 7.10563 19.9339 8.77892C18.981 7.9524 17.7614 7.49817 16.4999 7.49992H14.6249C14.5255 7.49992 14.4301 7.46041 14.3598 7.39008C14.2895 7.31976 14.2499 7.22437 14.2499 7.12492V5.24992Z" fill="#FFC31D" />
                    </svg>
                )
            case 'error':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.625 1.5H9C9.99456 1.5 10.9484 1.89509 11.6517 2.59835C12.3549 3.30161 12.75 4.25544 12.75 5.25V7.125C12.75 8.161 13.59 9 14.625 9H16.5C17.4946 9 18.4484 9.39509 19.1517 10.0983C19.8549 10.8016 20.25 11.7554 20.25 12.75V20.625C20.25 21.66 19.41 22.5 18.375 22.5H5.625C5.12772 22.5 4.65081 22.3025 4.29917 21.9508C3.94754 21.5992 3.75 21.1223 3.75 20.625V3.375C3.75 2.339 4.59 1.5 5.625 1.5ZM9.75 14.25C9.55109 14.25 9.36032 14.329 9.21967 14.4697C9.07902 14.6103 9 14.8011 9 15C9 15.1989 9.07902 15.3897 9.21967 15.5303C9.36032 15.671 9.55109 15.75 9.75 15.75H15C15.1989 15.75 15.3897 15.671 15.5303 15.5303C15.671 15.3897 15.75 15.1989 15.75 15C15.75 14.8011 15.671 14.6103 15.5303 14.4697C15.3897 14.329 15.1989 14.25 15 14.25H9.75Z" fill="#ED0028" />
                        <path d="M14.2499 5.24992C14.2517 3.98846 13.7975 2.76888 12.9709 1.81592C14.6442 2.25588 16.1706 3.13239 17.3941 4.3558C18.6175 5.57922 19.494 7.10563 19.9339 8.77892C18.981 7.9524 17.7614 7.49817 16.4999 7.49992H14.6249C14.5255 7.49992 14.4301 7.46041 14.3598 7.39008C14.2895 7.31976 14.2499 7.22437 14.2499 7.12492V5.24992Z" fill="#ED0028" />
                    </svg>
                )
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 md:items-center" onClick={onClose}>
            <div className="lg:w-[507px] w-full mx-[12px] lg:mx-0 bg-white rounded-[20px] md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-[20px] pt-[20px]">
                    <h2 className="lg:text-[28px] text-[20px] font-semibold text-[#33331F]">Новый заказ</h2>
                    <button onClick={onClose} className="cursor-pointer">
                        <svg className='w-[28px] h-[28px] lg:w-[24px] lg:h-[24px]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clipPath="url(#clip0_376_1878)">
                                <path d="M7 7L17 17M7 17L17 7" stroke="#B3B3B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_376_1878">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>

                <div className="px-[20px] mt-[24px]">
                    <div className='flex flex-col gap-[8px]'>
                        <label className="flex items-center gap-[4px] font-medium text-[13px] lg:text-[14px] text-[#B9B9B9]">
                            Трек-номер
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M1.5 8C1.5 4.41 4.41 1.5 8 1.5C11.59 1.5 14.5 4.41 14.5 8C14.5 11.59 11.59 14.5 8 14.5C4.41 14.5 1.5 11.59 1.5 8ZM9.08533 5.38867C8.492 4.87067 7.508 4.87067 6.91533 5.38867C6.81552 5.47601 6.6851 5.52013 6.55277 5.51132C6.42043 5.5025 6.29701 5.44148 6.20967 5.34167C6.12232 5.24186 6.0782 5.11144 6.08702 4.9791C6.09583 4.84676 6.15686 4.72334 6.25667 4.636C7.226 3.788 8.774 3.788 9.74333 4.636C10.752 5.51867 10.752 6.98133 9.74333 7.864C9.57464 8.01109 9.38697 8.13486 9.18533 8.232C8.73467 8.45067 8.5 8.748 8.5 9V9.5C8.5 9.63261 8.44732 9.75979 8.35355 9.85355C8.25979 9.94732 8.13261 10 8 10C7.86739 10 7.74022 9.94732 7.64645 9.85355C7.55268 9.75979 7.5 9.63261 7.5 9.5V9C7.5 8.14733 8.20667 7.59533 8.75 7.332C8.87133 7.27333 8.984 7.19933 9.08533 7.11133C9.63867 6.62667 9.63867 5.87333 9.08533 5.38867ZM8 12C8.13261 12 8.25979 11.9473 8.35355 11.8536C8.44732 11.7598 8.5 11.6326 8.5 11.5C8.5 11.3674 8.44732 11.2402 8.35355 11.1464C8.25979 11.0527 8.13261 11 8 11C7.86739 11 7.74022 11.0527 7.64645 11.1464C7.55268 11.2402 7.5 11.3674 7.5 11.5C7.5 11.6326 7.55268 11.7598 7.64645 11.8536C7.74022 11.9473 7.86739 12 8 12Z" fill="#B9B9B9" />
                            </svg>
                        </label>
                        <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="7711233456788"
                            className="w-full h-[44px] flex items-center px-[12px] border border-[#B9B9B966] rounded-[10px] font-medium text-[#333333] text-[15px] lg:text-[16px] outline-none"
                        />
                    </div>

                    <div className='mt-[20px] lg:mt-[24px] flex flex-col gap-[8px]'>
                        <label className="font-medium text-[13px] lg:text-[14px] text-[#333333]">Описание товара</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Кроссовки детские белого цвета"
                            rows={3}
                            className="w-full px-[12px] py-[15px] text-[15px] lg:text-[16px] text-[#333333] border border-[#B9B9B966] rounded-[10px] resize-none focus:outline-none"
                        />
                    </div>

                    <div className='mt-[18px] flex flex-col gap-[8px]'>
                        <label className="font-medium text-[13px] lg:text-[14px] text-[#333333]">Ссылка на товар</label>
                        <input
                            type="url"
                            value={productUrl}
                            onChange={(e) => setProductUrl(e.target.value)}
                            placeholder="https://"
                            className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-[12px] lg:gap-[16px] mt-[18px] lg:mt-[24px]">
                        <div>
                            <label className="font-medium text-[13px] lg:text-[14px] text-[#333333]">Цена за единицу</label>
                            <input
                                type="number"
                                value={costPerGood}
                                onChange={(e) => setCostPerGood(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="¥"
                                className="w-full h-[44px] px-[12px] text-[#333333] text-[15px] lg:text-[16px] border border-[#B9B9B966] rounded-[10px] outline-none"
                            />
                        </div>
                        <div>
                            <label className="font-medium text-[13px] lg:text-[14px] text-[#333333]">Количество</label>
                            <input
                                type="number"
                                value={count}
                                onChange={(e) => setCount(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="шт"
                                className="w-full h-[44px] px-[12px] text-[#333333] text-[15px] lg:text-[16px] border border-[#B9B9B966] rounded-[10px] outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor='thumbnailInput' className="border border-[#B9B9B966] rounded-[16px] w-full h-[200px] text-center mt-[20px] lg:mt-[24px] flex flex-col items-center justify-center cursor-pointer">
                            <div className="w-[48px] h-[40px] bg-[#B9B9B926] border border-[#FFFFFF] rounded-[10px] flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1.5 6C1.5 5.40326 1.73705 4.83097 2.15901 4.40901C2.58097 3.98705 3.15326 3.75 3.75 3.75H20.25C20.8467 3.75 21.419 3.98705 21.841 4.40901C22.2629 4.83097 22.5 5.40326 22.5 6V18C22.5 18.5967 22.2629 19.169 21.841 19.591C21.419 20.0129 20.8467 20.25 20.25 20.25H3.75C3.15326 20.25 2.58097 20.0129 2.15901 19.591C1.73705 19.169 1.5 18.5967 1.5 18V6ZM3 16.06V18C3 18.414 3.336 18.75 3.75 18.75H20.25C20.4489 18.75 20.6397 18.671 20.7803 18.5303C20.921 18.3897 21 18.1989 21 18V16.06L18.31 13.371C18.0287 13.0901 17.6475 12.9323 17.25 12.9323C16.8525 12.9323 16.4713 13.0901 16.19 13.371L15.31 14.25L16.28 15.22C16.3537 15.2887 16.4128 15.3715 16.4538 15.4635C16.4948 15.5555 16.5168 15.6548 16.5186 15.7555C16.5204 15.8562 16.5018 15.9562 16.4641 16.0496C16.4264 16.143 16.3703 16.2278 16.299 16.299C16.2278 16.3703 16.143 16.4264 16.0496 16.4641C15.9562 16.5018 15.8562 16.5204 15.7555 16.5186C15.6548 16.5168 15.5555 16.4948 15.4635 16.4538C15.3715 16.4128 15.2887 16.3537 15.22 16.28L10.06 11.121C9.77875 10.8401 9.3975 10.6823 9 10.6823C8.6025 10.6823 8.22125 10.8401 7.94 11.121L3 16.061V16.06ZM13.125 8.25C13.125 7.95163 13.2435 7.66548 13.4545 7.4545C13.6655 7.24353 13.9516 7.125 14.25 7.125C14.5484 7.125 14.8345 7.24353 15.0455 9.0455C14.8345 9.25647 14.5484 9.375 14.25 9.375C13.9516 9.375 13.6655 9.25647 13.4545 9.0455C13.2435 8.83452 13.125 8.54837 13.125 8.25Z" fill="#33331F" />
                                </svg>
                            </div>
                            <p className="text-[15px] lg:text-[16px] text-[#333333] font-medium">Фото</p>
                            <p className="text-[13px] lg:text-[14px] text-[#B9B9B9]">До 5 МБ</p>
                            {thumbnailFile && <p className="text-xs text-[#47D40A] mt-1">{thumbnailFile.name}</p>}
                        </label>
                        <input
                            type='file'
                            ref={thumbnailInputRef}
                            id='thumbnailInput'
                            onChange={handleThumbnailSelect}
                            className='hidden'
                            accept="image/*"
                        />
                    </div>

                    <div className='mt-[32px] flex flex-col gap-[16px] lg:gap-[20px]'>
                        <p className="font-semibold text-[18px] lg:text-[22px] text-[#33331F]">Загрузить таблицу</p>

                        <div
                            className="border border-dashed border-[#B9B9B966] rounded-[16px] w-full h-[192px] flex flex-col items-center justify-center text-center bg-[#F9F9F980] cursor-pointer transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <label className="w-[113px] h-[40px] flex items-center justify-center gap-[4px] outline-none border border-[#B9B9B94D] rounded-[10px] shadow-[0_0_25.8px_0_#0f0f2b26] bg-white cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6.64667 0.646715C6.74042 0.553081 6.8675 0.500488 7 0.500488C7.1325 0.500488 7.25958 0.553081 7.35333 0.646715L9.35333 2.64672C9.44165 2.7415 9.48974 2.86686 9.48745 2.9964C9.48517 3.12593 9.43269 3.24952 9.34108 3.34113C9.24947 3.43274 9.12588 3.48521 8.99635 3.4875C8.86681 3.48978 8.74145 3.4417 8.64667 3.35338L7.5 2.20671V4.50005H6.5V2.20671L5.35333 3.35338C5.25855 3.4417 5.13319 3.48978 5.00365 3.4875C4.87412 3.48521 4.75053 3.43274 4.65892 3.34113C4.56731 3.24952 4.51484 3.12593 4.51255 2.9964C4.51026 2.86686 4.55835 2.7415 4.64667 2.64672L6.64667 0.646715ZM6.5 4.50005V8.50005C6.5 8.63266 6.55268 8.75983 6.64645 8.8536C6.74022 8.94737 6.86739 9.00005 7 9.00005C7.13261 9.00005 7.25979 8.94737 7.35355 8.8536C7.44732 8.75983 7.5 8.63266 7.5 8.50005V4.50005H9.5C10.0304 4.50005 10.5391 4.71076 10.9142 5.08583C11.2893 5.46091 11.5 5.96962 11.5 6.50005V11.5C11.5 12.0305 11.2893 12.5392 10.9142 12.9143C10.5391 13.2893 10.0304 13.5 9.5 13.5H4.5C3.96957 13.5 3.46086 13.2893 3.08579 12.9143C2.71071 12.5392 2.5 12.0305 2.5 11.5V6.50005C2.5 5.96962 2.71071 5.46091 3.08579 5.08583C3.46086 4.71076 3.96957 4.50005 4.5 4.50005H6.5Z" fill="#ED0028" />
                                    <path d="M4.76709 14.4998C4.94263 14.8039 5.19519 15.0565 5.49936 15.2321C5.80352 15.4076 6.14857 15.4999 6.49976 15.4998H11.4998C12.0302 15.4998 12.5389 15.289 12.914 14.914C13.289 14.5389 13.4998 14.0302 13.4998 13.4998V8.49976C13.4998 7.75976 13.0978 7.11309 12.4998 6.76709V11.4998C12.4998 12.2954 12.1837 13.0585 11.6211 13.6211C11.0585 14.1837 10.2954 14.4998 9.49976 14.4998H4.76709Z" fill="#ED0028" />
                                </svg>
                                <span className='font-medium text-[14px] text-[#ED0028]'>Загрузить</span>
                            </label>
                            <p className="text-[15px] lg:text-[16px] font-medium text-[#333333] mt-[12px]">Выберите или перетащите файл</p>
                            <p className="text-[14px] text-[#B9B9B9] mt-[4px]">Максимум 500 МБ</p>
                        </div>

                        <input
                            type='file'
                            ref={fileInputRef}
                            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                            className='hidden'
                            accept=".xls,.xlsx"
                        />

                        {uploadedFile && (
                            <div className="mt-[16px]">
                                <div className="p-[12px] border border-[#B9B9B94D] rounded-[16px] flex flex-col gap-[16px]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-[12px] w-full">
                                            <div className={`w-[40px] h-[40px] rounded-[11px] flex items-center justify-center flex-shrink-0 ${uploadedFile.status === 'success' ? 'bg-[#47D40A1A]' : uploadedFile.status === 'uploading' ? 'bg-[#FFC31D1A]' : 'bg-[#ED00281A]'}`}>
                                                {getStatusIcon(uploadedFile.status)}
                                            </div>

                                            <div className="flex flex-col w-full">
                                                <div className='flex items-center justify-between w-full'>
                                                    <span className={`text-[14px] font-semibold leading-none ${uploadedFile.status === 'error' ? 'text-[#ED0028]' : 'text-[#333333]'}`}>
                                                        {uploadedFile.name}
                                                    </span>
                                                    <button onClick={removeFile} className="cursor-pointer">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M7 7L17 17M7 17L17 7" stroke="#B3B3B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-[12px] mt-[6px]">
                                                    <span className={`text-[12px] leading-none ${uploadedFile.status === 'error' ? 'text-[#ED0028]' : 'text-[#B3B3B3]'}`}>
                                                        {uploadedFile.size}
                                                    </span>
                                                    <div className={`w-[4px] h-[4px] rounded-full flex-shrink-0 ${uploadedFile.status === 'error' ? 'bg-[#ED0028]' : 'bg-[#B3B3B3]'}`} />
                                                    <span className={`text-[12px] leading-none text-[${uploadedFile.status === 'error' ? '#ED0028' : uploadedFile.status == 'success' ? '#47D40A' : '#B3B3B3'}]`}>
                                                        {uploadedFile.status === 'success' ? 'Успешно' : uploadedFile.status === 'uploading' ? 'Загрузка...' : 'Error'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col gap-[17px] lg:gap-[20px] mt-[32px]'>
                        <p className="font-semibold text-[18px] lg:text-[22px] text-[#33331F]">На кого таможим</p>
                        <div className="flex flex-col gap-[20px] lg:gap-[24px]">
                            <div className='flex flex-col gap-[8px]'>
                                <span className="font-medium text-[13px] lg:text-[14px] text-[#B9B9B9]">ФИО</span>
                                <select
                                    value={selectedClient?.id || ''}
                                    onChange={(e) => {
                                        const client = userClients.find(c => c.id === e.target.value)
                                        setSelectedClient(client || null)
                                    }}
                                    className="w-full h-[44px] px-[12px] border border-[#B9B9B966] rounded-[10px] bg-white outline-none text-[#333333] text-[15px] lg:text-[16px] cursor-pointer appearance-none"
                                >
                                    <option value="" disabled>Выберите клиента</option>
                                    {userClients.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.first_name} {client.last_name} {client.patronymic_name || ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 lg:gap-[16px] gap-[12px]">
                                <div className='flex flex-col gap-[8px]'>
                                    <span className="font-medium text-[13px] lg:text-[14px] text-[#B9B9B9]">Серия паспорта</span>
                                    <input readOnly value={selectedClient?.passport_series || ''} type="text" placeholder="45 01" className="px-[12px] lg:py-[11px] h-[44px] border border-[#B9B9B966] rounded-[10px] appearance-none bg-white outline-none" />
                                </div>
                                <div className='flex flex-col gap-[8px]'>
                                    <span className="font-medium text-[13px] lg:text-[14px] text-[#B9B9B9]">Номер паспорта</span>
                                    <input readOnly value={selectedClient?.passport_number || ''} type="text" placeholder="123456" className="px-[12px] lg:py-[11px] h-[44px] border border-[#B9B9B966] rounded-[10px] appearance-none bg-white outline-none" />
                                </div>
                            </div>

                            <div className='flex flex-col gap-[8px]'>
                                <span className="font-medium text-[13px] lg:text-[14px] text-[#B9B9B9]">Адрес</span>
                                <input
                                    readOnly
                                    value={selectedClient?.full_address || ''}
                                    type="text"
                                    placeholder="г. Москва, ул. Тверская, д. 12, кв. 34"
                                    className="px-[12px] lg:py-[11px] h-[44px] border border-[#B9B9B966] rounded-[10px] appearance-none bg-white outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selectedClient?.id || !uploadedFile || uploadedFile.status === 'error'}
                        className="lg:mt-[24px] mt-[16px] w-full h-[44px] outline-none border-none bg-[#ED0028] rounded-[10px] text-[15px] lg:text-[16px] text-white font-medium mb-[20px] cursor-pointer disabled:opacity-70"
                    >
                        {isSubmitting ? 'Создание заказа...' : 'Продолжить'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NewOrderPopup
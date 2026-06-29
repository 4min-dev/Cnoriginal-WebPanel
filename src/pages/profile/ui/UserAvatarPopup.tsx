import React, { useState, useCallback, type SetStateAction, useRef, useEffect } from 'react'
import type { CreateOrderError } from '../../orders/ui/NewOrderPopup'
import Button from '../../../ui/buttons/Button'
import { useDeleteProfileAvatarMutation, useUploadProfileAvatarMutation } from '../../../redux/services/uploadService'
import type { FetchBaseQueryError, QueryActionCreatorResult } from '@reduxjs/toolkit/query'
import type { QueryDefinition } from '@reduxjs/toolkit/query'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { FetchArgs } from '@reduxjs/toolkit/query'
import type { User } from '../../../types/User'
import isMobileDevice from '../../../assets/isMobileDevice'

type UploadedImage = {
    id: string,
    name: string,
    file: File,
    preview: string
}

const UserAvatarPopup: React.FC<{
    closeHandler: () => void,
    setError: React.Dispatch<SetStateAction<{ title: string, description: string } | null>>,
    userAvatar?: string,
    refetchProfile: () => QueryActionCreatorResult<QueryDefinition<void, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>, "Profile", {
        data: User
    }, "userService", unknown>>
}> = ({ closeHandler, setError, userAvatar, refetchProfile }) => {

    const [fetchToDeleteAvatar, { isLoading: isDeleteAvatarProcessing }] = useDeleteProfileAvatarMutation()
    const [fetchToUploadAvatar, { isLoading: isUpdateAvatarProcessing }] = useUploadProfileAvatarMutation()

    const [uploadedFile, setUploadedFile] = useState<UploadedImage | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (userAvatar && !uploadedFile) {
            const img = new Image()
            img.onload = () => {
                const tempFile = new File([], 'current-avatar.jpg', { type: 'image/jpeg' })
                setUploadedFile({
                    id: 'current',
                    name: 'current-avatar.jpg',
                    file: tempFile,
                    preview: userAvatar
                })
            }
            img.src = userAvatar
        }
    }, [userAvatar])

    useEffect(() => {
        return () => {
            if (uploadedFile?.preview && uploadedFile.id !== 'current') {
                URL.revokeObjectURL(uploadedFile.preview)
            }
        }
    }, [uploadedFile])

    const validateTableFile = async (file: File): Promise<CreateOrderError | null> => {
        if (file.size > 30 * 1024 * 1024) {
            return {
                title: 'Слишком большой файл',
                description: 'Файл слишком большой. Максимум 30 МБ.'
            }
        }
        return null
    }

    const handleFileSelect = useCallback(async (files: FileList | File[]) => {
        const fileList = Array.from(files)
        if (fileList.length === 0) return

        const newFile = fileList[0]
        const preview = URL.createObjectURL(newFile)

        const newUploadedFile: UploadedImage = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            name: newFile.name,
            file: newFile,
            preview
        }

        setUploadedFile(newUploadedFile)

        const error = await validateTableFile(newFile)
        setError(error)
    }, [])

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
    }, [handleFileSelect])

    async function handleButtonClick() {
        if (!uploadedFile || uploadedFile.id === 'current') return

        const formData = new FormData()
        formData.append('file', uploadedFile.file)

        try {
            await fetchToUploadAvatar(formData).unwrap()
            closeHandler()
        } catch (error: any) {
            console.error(error)
        } finally {
            refetchProfile()
        }
    }

    const handleRemoveImage = async () => {
        if (uploadedFile?.id === 'current') {
            await fetchToDeleteAvatar().unwrap()
            refetchProfile()
            closeHandler()
            return
        }

        if (uploadedFile?.preview) {
            URL.revokeObjectURL(uploadedFile.preview)
        }
        setUploadedFile(null)
        setError(null)
    }

    return (
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/60 z-[999] flex items-center justify-center" onClick={closeHandler}>
            <div
                className="p-[20px] lg:p-[28px] border border-[#F3F3F3] rounded-[20px] shadow-[0px_0px_25.8px_0px_#0F0F2B0D] lg:mr-0 lg:ml-0 mr-[16px] ml-[16px] relative bg-white flex flex-col lg:w-[436px] lg:h-[546px] overflow-y-auto w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="bg-none outline-none border-none cursor-pointer absolute top-[20px] right-[20px]"
                    onClick={closeHandler}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clipPath="url(#clip0_1326_17265)">
                            <path d="M7 7L17 17M7 17L17 7" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1326_17265">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>

                <span className="font-bold text-[20px] lg:text-[28px] text-[#33331F]">
                    Фото профиля
                </span>

                <div
                    className={`${!uploadedFile ? 'border border-dashed border-[#B9B9B966]' : ''} rounded-[16px] w-full h-[318px] lg:h-[380px] flex flex-col items-center justify-center text-center bg-[#F9F9F980] cursor-pointer transition-colors relative overflow-hidden mt-[16px] lg:mt-[24px]`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {uploadedFile && (
                        <>
                            <img
                                src={uploadedFile.preview}
                                alt="avatar"
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            <div className='flex items-center justify-center w-full h-full gap-[4px] z-20'>
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        fileInputRef.current?.click()
                                    }}
                                    className='bg-[#FFFFFF1A] w-[44px] h-[40px] rounded-[10px] flex items-center justify-center border border-[#B9B9B94D] cursor-pointer'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.99918 4.50001C11.2142 4.50001 12.4162 4.55501 13.6032 4.66201C13.7586 4.67584 13.9046 4.74272 14.0166 4.85142C14.1286 4.96012 14.1997 5.10404 14.2182 5.25901C14.3422 6.29701 14.4262 7.34701 14.4682 8.40901L12.7792 6.71901C12.6377 6.58246 12.4482 6.50695 12.2515 6.50875C12.0549 6.51055 11.8668 6.58952 11.7278 6.72864C11.5888 6.86776 11.51 7.05591 11.5084 7.25256C11.5068 7.44921 11.5825 7.63863 11.7192 7.78001L14.7182 10.78C14.8588 10.9205 15.0494 10.9994 15.2482 10.9994C15.4469 10.9994 15.6376 10.9205 15.7782 10.78L18.7792 7.78001C18.8529 7.71135 18.912 7.62855 18.953 7.53655C18.994 7.44455 19.016 7.34524 19.0178 7.24454C19.0195 7.14383 19.001 7.0438 18.9633 6.95042C18.9256 6.85703 18.8694 6.77219 18.7982 6.70097C18.727 6.62976 18.6422 6.57361 18.5488 6.53589C18.4554 6.49817 18.3554 6.47964 18.2547 6.48142C18.154 6.4832 18.0546 6.50524 17.9626 6.54623C17.8706 6.58722 17.7878 6.64633 17.7192 6.72001L15.9712 8.46701C15.9296 7.3352 15.8416 6.20558 15.7072 5.08101C15.6479 4.5846 15.4199 4.12363 15.0612 3.77535C14.7026 3.42707 14.2351 3.21265 13.7372 3.16801C11.2499 2.9431 8.74744 2.9431 6.26018 3.16801C5.76242 3.21287 5.29519 3.42739 4.93673 3.77565C4.57828 4.12391 4.35037 4.58476 4.29118 5.08101C4.2273 5.61658 4.17396 6.15335 4.13118 6.69101C4.12163 6.79005 4.13189 6.89001 4.16135 6.98504C4.19081 7.08008 4.23889 7.16831 4.30279 7.24458C4.36668 7.32086 4.44512 7.38365 4.53352 7.42932C4.62192 7.47498 4.71853 7.5026 4.81771 7.51056C4.91689 7.51852 5.01667 7.50667 5.11122 7.47569C5.20578 7.44471 5.29322 7.39523 5.36846 7.33012C5.44371 7.26502 5.50524 7.18559 5.54949 7.09647C5.59373 7.00734 5.6198 6.91031 5.62618 6.81101C5.66718 6.29101 5.71918 5.77301 5.78018 5.25901C5.79861 5.10404 5.86979 4.96012 5.98178 4.85142C6.09376 4.74272 6.23972 4.67584 6.39518 4.66201C7.59346 4.55385 8.79602 4.4998 9.99918 4.50001ZM5.28018 9.22001C5.13955 9.07956 4.94893 9.00067 4.75018 9.00067C4.55143 9.00067 4.3608 9.07956 4.22018 9.22001L1.21918 12.22C1.14549 12.2887 1.08639 12.3715 1.0454 12.4635C1.0044 12.5555 0.982362 12.6548 0.980585 12.7555C0.978809 12.8562 0.997333 12.9562 1.03505 13.0496C1.07278 13.143 1.12892 13.2278 1.20014 13.2991C1.27136 13.3703 1.35619 13.4264 1.44958 13.4641C1.54297 13.5019 1.643 13.5204 1.7437 13.5186C1.8444 13.5168 1.94372 13.4948 2.03572 13.4538C2.12771 13.4128 2.21052 13.3537 2.27918 13.28L4.02718 11.533C4.06918 12.674 4.15718 13.803 4.29118 14.919C4.35041 15.4154 4.57846 15.8764 4.93712 16.2247C5.29578 16.573 5.76324 16.7874 6.26118 16.832C8.74844 17.0568 11.2509 17.0568 13.7382 16.832C14.2359 16.7872 14.7032 16.5726 15.0616 16.2244C15.4201 15.8761 15.648 15.4153 15.7072 14.919C15.7712 14.385 15.8242 13.848 15.8672 13.309C15.8767 13.21 15.8665 13.11 15.837 13.015C15.8075 12.9199 15.7595 12.8317 15.6956 12.7554C15.6317 12.6792 15.5532 12.6164 15.4648 12.5707C15.3764 12.525 15.2798 12.4974 15.1806 12.4895C15.0815 12.4815 14.9817 12.4934 14.8871 12.5243C14.7926 12.5553 14.7051 12.6048 14.6299 12.6699C14.5546 12.735 14.4931 12.8144 14.4489 12.9036C14.4046 12.9927 14.3786 13.0897 14.3722 13.189C14.3312 13.709 14.2792 14.226 14.2182 14.741C14.1997 14.896 14.1286 15.0399 14.0166 15.1486C13.9046 15.2573 13.7586 15.3242 13.6032 15.338C11.2054 15.5549 8.79295 15.5549 6.39518 15.338C6.23972 15.3242 6.09376 15.2573 5.98178 15.1486C5.86979 15.0399 5.79861 14.896 5.78018 14.741C5.65516 13.6947 5.57176 12.6439 5.53018 11.591L7.21918 13.281C7.36069 13.4176 7.55018 13.4931 7.74683 13.4913C7.94348 13.4895 8.13155 13.4105 8.27054 13.2714C8.40953 13.1323 8.48832 12.9441 8.48993 12.7475C8.49155 12.5508 8.41586 12.3614 8.27918 12.22L5.28018 9.22001Z" fill="white" />
                                    </svg>
                                </button>

                                <button
                                    type='button'
                                    disabled={isDeleteAvatarProcessing}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRemoveImage()
                                    }}
                                    className='bg-[#FFFFFF1A] w-[44px] h-[40px] rounded-[10px] flex items-center justify-center border border-[#B9B9B94D] cursor-pointer'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M13.75 3.73165V3.92082C14.8325 4.01981 15.9106 4.16215 16.9817 4.34749C17.0625 4.3615 17.1399 4.39129 17.2092 4.43518C17.2786 4.47907 17.3386 4.5362 17.3859 4.60329C17.4332 4.67038 17.4668 4.74612 17.4848 4.8262C17.5028 4.90628 17.5048 4.98911 17.4908 5.06999C17.4768 5.15086 17.447 5.22818 17.4031 5.29754C17.3593 5.36689 17.3021 5.42693 17.235 5.47421C17.1679 5.52149 17.0922 5.55509 17.0121 5.5731C16.932 5.5911 16.8492 5.59316 16.7683 5.57915L16.5942 5.54999L15.7567 16.4417C15.7084 17.0696 15.4248 17.6563 14.9627 18.0842C14.5006 18.5122 13.894 18.75 13.2642 18.75H6.73667C6.10683 18.75 5.50022 18.5122 5.03811 18.0842C4.576 17.6563 4.29246 17.0696 4.24417 16.4417L3.40584 5.54999L3.23167 5.57915C3.1508 5.59316 3.06796 5.5911 2.98788 5.5731C2.90781 5.55509 2.83206 5.52149 2.76497 5.47421C2.62948 5.37872 2.53746 5.23332 2.50917 5.06999C2.48088 4.90666 2.51863 4.73878 2.61412 4.60329C2.70961 4.46779 2.85501 4.37578 3.01834 4.34749C4.08939 4.16192 5.16749 4.01959 6.25001 3.92082V3.73165C6.25001 2.42832 7.26084 1.31499 8.59667 1.27249C9.53227 1.24254 10.4686 1.24254 11.4042 1.27249C12.74 1.31499 13.75 2.42832 13.75 3.73165ZM8.63667 2.52165C9.54561 2.49258 10.4552 2.49258 11.3642 2.52165C11.9917 2.54165 12.5 3.06999 12.5 3.73165V3.82582C10.8349 3.72469 9.16514 3.72469 7.50001 3.82582V3.73165C7.50001 3.06999 8.00751 2.54165 8.63667 2.52165ZM8.34084 7.47582C8.33767 7.39374 8.31836 7.3131 8.28402 7.23848C8.24967 7.16387 8.20097 7.09675 8.14069 7.04096C8.08041 6.98516 8.00973 6.94179 7.93269 6.91331C7.85565 6.88484 7.77375 6.87181 7.69167 6.87499C7.6096 6.87816 7.52895 6.89747 7.45433 6.93181C7.37972 6.96615 7.3126 7.01485 7.25681 7.07513C7.20102 7.13542 7.15764 7.20609 7.12917 7.28314C7.10069 7.36018 7.08767 7.44208 7.09084 7.52415L7.38001 15.0242C7.38642 15.1898 7.45837 15.3461 7.58003 15.4587C7.64027 15.5145 7.71091 15.5578 7.7879 15.5863C7.86489 15.6147 7.94673 15.6277 8.02876 15.6246C8.11078 15.6214 8.19137 15.6021 8.26593 15.5678C8.3405 15.5335 8.40757 15.4848 8.46332 15.4245C8.51908 15.3643 8.56242 15.2937 8.59088 15.2167C8.61933 15.1397 8.63235 15.0578 8.62917 14.9758L8.34084 7.47582ZM12.9075 7.52415C12.9136 7.4405 12.9028 7.35647 12.8758 7.27708C12.8487 7.19768 12.806 7.12455 12.7501 7.06202C12.6942 6.9995 12.6262 6.94887 12.5504 6.91314C12.4745 6.87742 12.3922 6.85734 12.3083 6.85409C12.2245 6.85085 12.1409 6.86451 12.0625 6.89426C11.9841 6.924 11.9124 6.96923 11.8519 7.02725C11.7913 7.08526 11.743 7.15487 11.7099 7.23194C11.6768 7.30901 11.6595 7.39195 11.6592 7.47582L11.37 14.9758C11.3636 15.1416 11.4233 15.3031 11.536 15.4248C11.6487 15.5466 11.8051 15.6186 11.9708 15.625C12.1366 15.6314 12.2981 15.5717 12.4199 15.459C12.5416 15.3463 12.6136 15.1899 12.62 15.0242L12.9075 7.52415Z" fill="white" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}

                    {!uploadedFile && (
                        <>
                            <label className="w-[113px] h-[40px] flex items-center justify-center gap-[4px] outline-none border border-[#B9B9B94D] rounded-[10px] shadow-[0_0_25.8px_0_#0f0f2b26] bg-white cursor-pointer lg:order-none order-[2] mt-[12px] lg:mt-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6.64667 0.646715C6.74042 0.553081 6.8675 0.500488 7 0.500488C7.1325 0.500488 7.25958 0.553081 7.35333 0.646715L9.35333 2.64672C9.44165 2.7415 9.48974 2.86686 9.48745 2.9964C9.48517 3.12593 9.43269 3.24952 9.34108 3.34113C9.24947 3.43274 9.12588 3.48521 8.99635 3.4875C8.86681 3.48978 8.74145 3.4417 8.64667 3.35338L7.5 2.20671V4.50005H6.5V2.20671L5.35333 3.35338C5.25855 3.4417 5.13319 3.48978 5.00365 3.4875C4.87412 3.48521 4.75053 3.43274 4.65892 3.34113C4.56731 3.24952 4.51484 3.12593 4.51255 2.9964C4.51026 2.86686 4.55835 2.7415 4.64667 2.64672L6.64667 0.646715ZM6.5 4.50005V8.50005C6.5 8.63266 6.55268 8.75983 6.64645 8.8536C6.74022 8.94737 6.86739 9.00005 7 9.00005C7.13261 9.00005 7.25979 8.94737 7.35355 8.8536C7.44732 8.75983 7.5 8.63266 7.5 8.50005V4.50005H9.5C10.0304 4.50005 10.5391 4.71076 10.9142 5.08583C11.2893 5.46091 11.5 5.96962 11.5 6.50005V11.5C11.5 12.0305 11.2893 12.5392 10.9142 12.9143C10.5391 13.2893 10.0304 13.5 9.5 13.5H4.5C3.96957 13.5 3.46086 13.2893 3.08579 12.9143C2.71071 12.5392 2.5 12.0305 2.5 11.5V6.50005C2.5 5.96962 2.71071 5.46091 3.08579 5.08583C3.46086 4.71076 3.96957 4.50005 4.5 4.50005H6.5Z" fill="#ED0028" />
                                    <path d="M4.76709 14.4998C4.94263 14.8039 5.19519 15.0565 5.49936 15.2321C5.80352 15.4076 6.14857 15.4999 6.49976 15.4998H11.4998C12.0302 15.4998 12.5389 15.289 12.914 14.914C13.289 14.5389 13.4998 14.0302 13.4998 13.4998V8.49976C13.4998 7.75976 13.0978 7.11309 12.4998 6.76709V11.4998C12.4998 12.2954 12.1837 13.0585 11.6211 13.6211C11.0585 14.1837 10.2954 14.4998 9.49976 14.4998H4.76709Z" fill="#ED0028" />
                                </svg>
                                <span className="font-medium text-[14px] text-[#ED0028]">Загрузить</span>
                            </label>
                            <p className="text-[15px] lg:text-[16px] font-medium text-[#333333] mt-[12px]">{isMobileDevice() ? "Выберите файл" : "Выберите или перетащите фото"}</p>
                            <p className="text-[14px] text-[#B9B9B9] mt-[4px]">Максимум 30 МБ</p>
                        </>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                    className="hidden"
                />

                <div className="flex items-center justify-between mt-[16px] gap-[8px]">
                    <Button
                        className="grow h-[44px] rounded-[10px] font-medium text-[15px]"
                        buttonText={isUpdateAvatarProcessing ? 'Обновляем' : 'Применить'}
                        clickHandler={handleButtonClick}
                        disabled={!uploadedFile || uploadedFile.id === 'current' || isUpdateAvatarProcessing}
                    />

                    <button
                        type="button"
                        onClick={closeHandler}
                        className="grow h-[44px] rounded-[10px] font-medium text-[15px] outline-none border-none bg-[#F5F5F5] text-[#333333] cursor-pointer"
                    >
                        Отменить
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserAvatarPopup
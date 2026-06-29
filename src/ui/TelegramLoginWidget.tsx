import { useCallback } from 'react'
import type TelegramUser from '../types/TelegramUser'
import Button from './buttons/Button'
import TelegramIcon from './icons/TelegramIcon'

interface Props {
    onAuth: (user: TelegramUser) => void
    botId: number
}

const TelegramLoginWidget = ({ onAuth, botId }: Props) => {
    const openTelegramAuth = useCallback(() => {
        const origin = encodeURIComponent(window.location.origin)
        const returnTo = encodeURIComponent(window.location.href)

        const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${origin}&return_to=${returnTo}&request_access=write&embed=0`

        const width = 600
        const height = 550
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2

        const popup = window.open(
            authUrl,
            'telegram-auth',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no,status=no`
        )

        if (!popup) {
            alert('Пожалуйста, разрешите всплывающие окна')
            return
        }

        const messageHandler = (event: MessageEvent) => {
            if (event.origin !== 'https://oauth.telegram.org') return

            const data = JSON.parse(event.data)

            if (data && typeof data == 'object' && data.result) {
                onAuth(data.result as TelegramUser)
                popup.close()
                window.removeEventListener('message', messageHandler)
            }
        }

        window.addEventListener('message', messageHandler)

        const checkClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkClosed)
                window.removeEventListener('message', messageHandler)
            }
        }, 500)
    }, [onAuth, botId])

    return (
        <Button
            buttonText="Привязать Telegram"
            clickHandler={openTelegramAuth}
            className="h-[48px] gap-[8px] rounded-[12px]"
            icon={<TelegramIcon />}
        />
    )
}

export default TelegramLoginWidget
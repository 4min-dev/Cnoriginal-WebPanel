import { useEffect, useRef } from 'react'
import type TelegramUser from '../types/TelegramUser'

interface Props {
    onAuth: (user: TelegramUser) => void
    botName: string
}

const TelegramLoginWidget = ({ onAuth, botName }: Props) => {
    const widgetRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        window.onTelegramAuth = onAuth

        if (widgetRef.current) {
            widgetRef.current.innerHTML = ''

            const script = document.createElement('script')
            script.src = 'https://telegram.org/js/telegram-widget.js?22'
            script.setAttribute('data-telegram-login', botName)
            script.setAttribute('data-size', 'large')
            script.setAttribute('data-radius', '8')
            script.setAttribute('data-onauth', 'onTelegramAuth(user)')
            script.setAttribute('data-request-access', 'write')
            script.async = true

            widgetRef.current.appendChild(script)
        }

        return () => {
            delete window.onTelegramAuth
            if (widgetRef.current) {
                widgetRef.current.innerHTML = ''
            }
        }
    }, [onAuth, botName])

    return <div ref={widgetRef} />
}

export default TelegramLoginWidget
import { useGetProfileQuery } from '../redux/services/userService'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

const devMode = import.meta.env.VITE_DEV_MODE === 'true'

export const useAuth = () => {
    const auth = useSelector((state: RootState) => state.auth)

    const { data: profile, isLoading, isError, refetch } = useGetProfileQuery(undefined, {
        skip: (!auth.isAuthenticated && !auth.refreshToken) && !devMode
    })

    const isAuthenticated = auth.isAuthenticated && !!profile?.data?.id
    const user = profile?.data || null

    return {
        isAuthenticated,
        user,
        isLoading,
        isError,
        auth,
        refetchProfile: refetch,
    }
}
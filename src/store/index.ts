import { configureStore } from "@reduxjs/toolkit"
import { referralService } from "../redux/services/referralService"
import { authService } from "../redux/services/authService"
import authReducer from '../redux/slices/authSlice'
import { notificationsService } from "../redux/services/notificationsService"
import { balanceService } from "../redux/services/balanceService"
import { userService } from "../redux/services/userService"
import { deliveryService } from "../redux/services/deliveryService"
import { dobropostService } from "../redux/services/dobropostOrders"
import { subscriptionService } from "../redux/services/subscriptionService"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [referralService.reducerPath]: referralService.reducer,
        [authService.reducerPath]: authService.reducer,
        [dobropostService.reducerPath]: dobropostService.reducer,
        [notificationsService.reducerPath]: notificationsService.reducer,
        [balanceService.reducerPath]: balanceService.reducer,
        [userService.reducerPath]: userService.reducer,
        [deliveryService.reducerPath]: deliveryService.reducer,
        [subscriptionService.reducerPath]: subscriptionService.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        referralService.middleware,
        authService.middleware,
        dobropostService.middleware,
        notificationsService.middleware,
        balanceService.middleware,
        userService.middleware,
        deliveryService.middleware,
        subscriptionService.middleware,
    )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
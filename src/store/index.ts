import { configureStore } from "@reduxjs/toolkit";
import { referralService } from "../redux/services/referralService";
import { authService } from "../redux/services/authService";
import authReducer from "../redux/slices/authSlice";
import { notificationsService } from "../redux/services/notificationsService";
import { balanceService } from "../redux/services/balanceService";
import { userService } from "../redux/services/userService";
import { deliveryService } from "../redux/services/deliveryService";
import { dobropostService } from "../redux/services/dobropostOrders";
import { subscriptionService } from "../redux/services/subscriptionService";
import { clientService } from "../redux/services/clientService";
import { uploadService } from "../redux/services/uploadService";
import { enumService } from "../redux/services/enumService";
import { paymentService } from "../redux/services/paymentService";
import { payAllOrders } from "../redux/services/payAllOrdersService";
import { payAllDeliveries } from "../redux/services/payAllDeliveries";
import { sheetsService } from "../redux/services/sheetsService";
import { warehouseService } from "../redux/services/warehousesService";
import { changeOrderStatus } from "../redux/services/changeOrderStatus";

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
    [clientService.reducerPath]: clientService.reducer,
    [uploadService.reducerPath]: uploadService.reducer,
    [enumService.reducerPath]: enumService.reducer,
    [paymentService.reducerPath]: paymentService.reducer,
    [payAllOrders.reducerPath]: payAllOrders.reducer,
    [payAllDeliveries.reducerPath]: payAllDeliveries.reducer,
    [sheetsService.reducerPath]: sheetsService.reducer,
    [warehouseService.reducerPath]: warehouseService.reducer,
    [changeOrderStatus.reducerPath]: changeOrderStatus.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      referralService.middleware,
      authService.middleware,
      dobropostService.middleware,
      notificationsService.middleware,
      balanceService.middleware,
      userService.middleware,
      deliveryService.middleware,
      subscriptionService.middleware,
      clientService.middleware,
      uploadService.middleware,
      enumService.middleware,
      paymentService.middleware,
      payAllOrders.middleware,
      payAllDeliveries.middleware,
      sheetsService.middleware,
      warehouseService.middleware,
      changeOrderStatus.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

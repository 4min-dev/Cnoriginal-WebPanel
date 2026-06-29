import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseService";
import type { CreateDelivery, Delivery } from "../../types/Delivery";

export const deliveryService = createApi({
  reducerPath: "deliveryService",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Delivery"],
  endpoints: (builder) => ({
    getDeliveryOrders: builder.query<{ data: { delivery: Delivery[] } }, void>({
      query: () => ({
        url: "/delivery",
      }),
      providesTags: ["Delivery"],
    }),

    createDeliveryOrder: builder.mutation<CreateDelivery, CreateDelivery>({
      query: (body) => ({
        url: "/delivery",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Delivery"],
    }),

    payDeliveryOrder: builder.mutation<
      {
        data: {
          id: string;
          status: "paid" | 'success';
        };
      },
      string
    >({
      query: (delivery_id) => ({
        url: `/delivery/${delivery_id}/pay`,
        method: "POST",
      }),
      invalidatesTags: ["Delivery"],
    }),
    payAllDeliveries: builder.mutation<
      {
        data: {
          id: string;
          status: "paid";
        };
      },
      string
    >({
      query: () => ({
        url: `/delivery-all-pay`,
        method: "POST",
      }),
      invalidatesTags: ["Delivery"],
    }),
  }),
});

export const {
  useGetDeliveryOrdersQuery,
  useCreateDeliveryOrderMutation,
  usePayDeliveryOrderMutation,
  usePayAllDeliveriesMutation,
} = deliveryService;

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseService";
import type { getDeliveryCompanies } from "../../types/ApiEnums";

export const enumService = createApi({
  reducerPath: "types",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getDeliveryCompaniesEnum: builder.query<
      { data: typeof getDeliveryCompanies },
      void
    >({
      query: () => ({
        url: "/types/enums",
        params: {
          types: "delivery_company",
        },
      }),
    }),
  }),
});

export const { useGetDeliveryCompaniesEnumQuery } = enumService;

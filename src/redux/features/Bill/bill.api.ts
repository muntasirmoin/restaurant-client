import { baseApi } from "@/redux/baseApi";
export const billApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateBill: builder.mutation({
      query: (payload: {
        orderId: string;
        discount?: number;
        taxRate?: number;
        paymentMethod?: string;
      }) => ({ url: "/bills", method: "POST", data: payload }),
      invalidatesTags: ["BILL", "ORDER"],
    }),
    getBills: builder.query({
      query: () => ({ url: "/bills", method: "GET" }),
      providesTags: ["BILL"],
    }),
  }),
});
export const { useGenerateBillMutation, useGetBillsQuery } = billApi;

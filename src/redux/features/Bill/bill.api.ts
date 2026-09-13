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
      query: (date?: string) => ({
        url: "/bills",
        method: "GET",
        params: date ? { date } : undefined,
      }),
      providesTags: ["BILL"],
    }),
  }),
});
export const { useGenerateBillMutation, useGetBillsQuery } = billApi;

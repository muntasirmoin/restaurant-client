import { baseApi } from "@/redux/baseApi";
export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({ url: "/orders", method: "GET" }),
      providesTags: ["ORDER"],
    }),
    createOrder: builder.mutation({
      query: (payload) => ({ url: "/orders", method: "POST", data: payload }),
      invalidatesTags: ["ORDER"],
    }),
    markServed: builder.mutation({
      query: (orderId: string) => ({
        url: `/orders/${orderId}/served`,
        method: "PATCH",
      }),
      invalidatesTags: ["ORDER"],
    }),

    confirmOrder: builder.mutation({
      query: (orderId: string) => ({
        url: `/orders/${orderId}/confirm`,
        method: "PATCH",
      }),
      invalidatesTags: ["ORDER"],
    }),
    cancelOrder: builder.mutation({
      query: (orderId: string) => ({
        url: `/orders/${orderId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["ORDER"],
    }),

    updateKitchenStatus: builder.mutation({
      query: ({
        orderId,
        status,
      }: {
        orderId: string;
        status: "preparing" | "ready";
      }) => ({
        url: `/orders/${orderId}/kitchen-status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["ORDER"],
    }),
  }),
});
export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useMarkServedMutation,
  useConfirmOrderMutation,
  useCancelOrderMutation,
  useUpdateKitchenStatusMutation,
} = orderApi;

import { baseApi } from "@/redux/baseApi";
export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query({
      query: (days: number) => {
        const to = new Date();
        const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
        return {
          url: "/reports/sales",
          method: "GET",
          params: { from: from.toISOString(), to: to.toISOString() },
        };
      },
      providesTags: ["REPORT"],
    }),
  }),
});
export const { useGetSalesReportQuery } = reportApi;

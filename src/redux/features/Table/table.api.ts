import { baseApi } from "@/redux/baseApi";
export const tableApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTables: builder.query({
      query: () => ({ url: "/tables", method: "GET" }),
      providesTags: ["TABLE"],
    }),
  }),
});
export const { useGetTablesQuery } = tableApi;

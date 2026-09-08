import { baseApi } from "@/redux/baseApi";
export const menuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMenu: builder.query({
      query: () => ({ url: "/menu", method: "GET" }),
      providesTags: ["MENU"],
    }),
    createMenuItem: builder.mutation({
      query: (payload) => ({ url: "/menu", method: "POST", data: payload }),
      invalidatesTags: ["MENU"],
    }),
    updateMenuItem: builder.mutation({
      query: ({ id, ...payload }: { id: string; [key: string]: unknown }) => ({
        url: `/menu/${id}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["MENU"],
    }),
  }),
});
export const {
  useGetMenuQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
} = menuApi;

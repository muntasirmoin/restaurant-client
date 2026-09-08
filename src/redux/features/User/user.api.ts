import { baseApi } from "@/redux/baseApi";
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({ url: "/users", method: "GET" }),
      providesTags: ["USER"],
    }),
    createUser: builder.mutation({
      query: (payload) => ({ url: "/users", method: "POST", data: payload }),
      invalidatesTags: ["USER"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...payload }: { id: string; [key: string]: unknown }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});
export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = userApi;

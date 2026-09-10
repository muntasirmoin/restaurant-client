import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AUTH", "USER", "MENU", "TABLE", "ORDER", "BILL", "REPORT"],
  endpoints: () => ({}),
});

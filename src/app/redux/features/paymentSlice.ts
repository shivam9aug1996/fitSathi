import { deleteCookies } from "@/app/actions";
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["paymentList"],
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (data) => ({
        url: "/payments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["paymentList"],
    }),
    updatePayment: builder.mutation({
      query: (data) => ({
        url: "/payments",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["paymentList"],
    }),
    getPaymentList: builder.query({
      query: (data) => ({
        url: "/payments",
        method: "GET",
        params: {
          memberId: data?.memberId,
        },
      }),
      providesTags: ["paymentList"],
    }),
    deletePayment: builder.mutation({
      query: (data) => ({
        url: "/payments",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["paymentList"],
    }),
  }),
});

const paymentSlice = createSlice({
  name: "paymentSlice",
  initialState: {
    // token: null,
    // userData: null,
    // authLoader: false,
    // reduxStarted: false,
    //selectedGymId: null,
  },
  reducers: {
    // setGymIdSelected: (state, action) => {
    //   state.selectedGymId = action.payload;
    // },
  },
  extraReducers: (builder) => {},
});

export const {
  useGetPaymentListQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentApi;

export const {} = paymentSlice.actions;

export default paymentSlice.reducer;

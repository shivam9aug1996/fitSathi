import { deleteCookies } from "@/app/actions";
import { daysUntilExpiration, getDifferenceInDays } from "@/app/functions";
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const memberApi = createApi({
  reducerPath: "memberApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["memberList"],
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    createMember: builder.mutation({
      query: (data) => ({
        url: "/member",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["memberList"],
    }),
    updateMember: builder.mutation({
      query: (data) => ({
        url: "/member",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["memberList"],
    }),
    getMemberList: builder.query({
      query: (data) => ({
        url: "/member",
        method: "GET",
        params: {
          gymId: data?.gymId,
          isActive: data?.isActive,
          startRange: data?.startRange,
          endRange: data?.endRange,
        },
      }),
      providesTags: ["memberList"],
      transformResponse: (baseQueryReturnValue) => {
        console.log("jhgfdsr898765", baseQueryReturnValue);
        let arr = baseQueryReturnValue?.members?.map((item) => {
          return {
            ...item,
            status:
              daysUntilExpiration(item?.latestPayment?.endDate) >= 0
                ? "Active"
                : "Expired",
            daysLeft:
              daysUntilExpiration(item?.latestPayment?.endDate) >= 0
                ? daysUntilExpiration(item?.latestPayment?.endDate)
                : -1,
            amountDue: item?.latestPayment
              ? item?.latestPayment?.amountDue
              : -1,
          };
        });
        return {
          members: arr || [],
        };
      },
    }),
    deleteMember: builder.mutation({
      query: (data) => ({
        url: "/member",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["memberList"],
    }),
  }),
});

const memberSlice = createSlice({
  name: "memberSlice",
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
  useGetMemberListQuery,
  useDeleteMemberMutation,
  useCreateMemberMutation,
  useUpdateMemberMutation,
} = memberApi;

export const {} = memberSlice.actions;

export default memberSlice.reducer;

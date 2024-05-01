import { deleteCookies } from "@/app/actions";
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const memberApi = createApi({
  reducerPath: "memberApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["memberList"],
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
        },
      }),
      providesTags: ["memberList"],
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

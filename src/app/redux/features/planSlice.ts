import { deleteCookies } from "@/app/actions";
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const planApi = createApi({
  reducerPath: "planApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["planList"],
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    createPlan: builder.mutation({
      query: (data) => ({
        url: "/plan",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["planList"],
    }),
    updatePlan: builder.mutation({
      query: (data) => ({
        url: "/plan",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["planList"],
    }),
    getPlanList: builder.query({
      query: (data) => ({
        url: "/plan",
        method: "GET",
        params: {
          gymId: data?.gymId,
        },
      }),
      providesTags: ["planList"],
    }),
    deletePlan: builder.mutation({
      query: (data) => ({
        url: "/plan",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["planList"],
    }),
  }),
});

const planSlice = createSlice({
  name: "planSlice",
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
  useGetPlanListQuery,
  useDeletePlanMutation,
  useCreatePlanMutation,
  useUpdatePlanMutation,
} = planApi;

export const {} = planSlice.actions;

export default planSlice.reducer;

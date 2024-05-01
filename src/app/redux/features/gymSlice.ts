import { deleteCookies } from "@/app/actions";
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const gymApi = createApi({
  reducerPath: "gymApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    // prepareHeaders: async (headers) => {
    //   headers.set("user-fingerprint", await getFp());
    // },
  }),
  tagTypes: ["gymList", "dashboard"],
  endpoints: (builder) => ({
    createGym: builder.mutation({
      query: (data) => ({
        url: "/gym",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["gymList", "dashboard"],
    }),
    updateGym: builder.mutation({
      query: (data) => ({
        url: "/gym",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["gymList", "dashboard"],
    }),
    getGymList: builder.query({
      query: (data) => ({
        url: "/gym",
        method: "GET",
        params: {
          userId: data?.userId,
        },
      }),
      providesTags: ["gymList"],
    }),
    deleteGym: builder.mutation({
      query: (data) => ({
        url: "/gym",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["gymList", "dashboard"],
    }),
    getDashboardDetails: builder.query({
      query: (data) => ({
        url: "/dashboard",
        method: "GET",
        params: {
          gymId: data?.gymId,
        },
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

const gymSlice = createSlice({
  name: "gymSlice",
  initialState: {
    // token: null,
    // userData: null,
    // authLoader: false,
    // reduxStarted: false,
    selectedGymId: null,
    gymLoader: 0,
  },
  reducers: {
    setGymIdSelected: (state, action) => {
      state.selectedGymId = action.payload;
    },
    // setAuth: (state, action) => {
    //   console.log("kiuytrdfghj", action.payload);
    //   if (action?.payload?.userData) {
    //     state.userData = JSON.parse(action?.payload?.userData);
    //     state.token = action?.payload?.token;
    //   } else {
    //     state.userData = null;
    //   }
    //   state.reduxStarted = true;
    // },
    // setAuthLoader: (state, action) => {
    //   state.authLoader = action.payload;
    // },
  },
  extraReducers: (builder) => {
    // builder.addMatcher(
    //   gymApi.endpoints.login.matchFulfilled,
    //   (state, action) => {
    //     state.token = action.payload?.token || null;
    //     state.userData = action.payload?.userData || null;
    //   }
    // );
    builder.addMatcher(
      gymApi.endpoints.getGymList.matchPending,
      (state, action) => {
        state.gymLoader = 1;
      }
    );
    builder.addMatcher(
      gymApi.endpoints.getGymList.matchFulfilled,
      (state, action) => {
        state.gymLoader = 2;
        if (action.payload?.gyms?.length == 0) {
          state.selectedGymId = null;
        } else {
          for (const gym of action.payload?.gyms) {
            // Check if the gym is primary
            if (gym?.isPrimary === true) {
              state.selectedGymId = gym?._id;
              //dispatch(setGymIdSelected(gym?._id));
              //return gym; // Return the primary gym
            }
          }
        }
      }
    );
    builder.addMatcher(
      gymApi.endpoints.getGymList.matchRejected,
      (state, action) => {
        state.gymLoader = 2;
      }
    );
    // builder.addMatcher(gymApi.endpoints.logout.matchFulfilled, (state) => {
    //   state.token = null;
    //   state.userData = null;
    //   deleteCookies();
    // });
  },
});

export const {
  useGetGymListQuery,
  useUpdateGymMutation,
  useDeleteGymMutation,
  useCreateGymMutation,
  useGetDashboardDetailsQuery,
} = gymApi;

export const { setGymIdSelected } = gymSlice.actions;

export default gymSlice.reducer;

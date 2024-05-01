import { deleteCookies } from "@/app/actions";
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth",
    // prepareHeaders: async (headers) => {
    //   headers.set("user-fingerprint", await getFp());
    // },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: "/signup",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    token: null,
    userData: null,
    authLoader: false,
    reduxStarted: false,
  },
  reducers: {
    setAuth: (state, action) => {
      console.log("kiuytrdfghj", action.payload);
      if (action?.payload?.userData) {
        state.userData = JSON.parse(action?.payload?.userData);
        state.token = action?.payload?.token;
      } else {
        state.userData = null;
      }
      state.reduxStarted = true;
    },
    setAuthLoader: (state, action) => {
      state.authLoader = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.token = action.payload?.token || null;
        state.userData = action.payload?.userData || null;
      }
    );

    builder.addMatcher(
      authApi.endpoints.signup.matchFulfilled,
      (state, action) => {
        state.token = action.payload?.token || null;
        state.userData = action.payload?.userData || null;
      }
    );
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.token = null;
      state.userData = null;
      deleteCookies();
    });
  },
});

export const { useLoginMutation, useLogoutMutation, useSignupMutation } =
  authApi;

export const { setAuth, setAuthLoader } = authSlice.actions;

export default authSlice.reducer;

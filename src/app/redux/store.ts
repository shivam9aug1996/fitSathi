import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import attendanceSlice, { attendanceApi } from "./features/attendanceSlice";
import authSlice, { authApi } from "./features/authSlice";
import gymSlice, { gymApi } from "./features/gymSlice";
import memberSlice, { memberApi } from "./features/memberSlice";
import paymentSlice, { paymentApi } from "./features/paymentSlice";
import planSlice, { planApi } from "./features/planSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    gym: gymSlice,
    [gymApi.reducerPath]: gymApi.reducer,
    plan: planSlice,
    [planApi.reducerPath]: planApi.reducer,
    member: memberSlice,
    [memberApi.reducerPath]: memberApi.reducer,
    payment: paymentSlice,
    [paymentApi.reducerPath]: paymentApi.reducer,
    attendance: attendanceSlice,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(gymApi.middleware)
      .concat(planApi.middleware)
      .concat(memberApi.middleware)
      .concat(paymentApi.middleware)
      .concat(attendanceApi.middleware),
});

export default store;
setupListeners(store.dispatch);

"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../redux/features/authSlice";
import { gymApi } from "../redux/features/gymSlice";
import { memberApi } from "../redux/features/memberSlice";
import { paymentApi } from "../redux/features/paymentSlice";
import { planApi } from "../redux/features/planSlice";

const page = () => {
  const userId = useSelector((state) => state?.auth?.userData?.userId || null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [
    logout,
    {
      isSuccess: isLogoutSuccess,
      isLoading: isLogoutLoading,
      isError: isLogoutError,
      error: logoutError,
      data: logoutData,
    },
  ] = useLogoutMutation();
  useEffect(() => {
    if (!userId) {
      // router.push("/");
      window.location.href = "/";
    }
    logout()
      ?.unwrap()
      ?.then(() => {
        window.location.href = "/";
      });
  }, []);
  return null;
};

export default page;

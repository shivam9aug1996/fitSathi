"use client";

import React, { useLayoutEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

import { setAuth } from "../redux/features/authSlice";

import store from "../redux/store";

import { NextUIProvider } from "@nextui-org/react";
import { setGymIdSelected } from "../redux/features/gymSlice";

const Providers = ({ children, getCookies }: any) => {
  useLayoutEffect(() => {
    getCookie();
  }, []);
  const getCookie = async () => {
    let data = await getCookies();
    store.dispatch(setAuth(data));
    // console.log("87trfghj", data);
    // let userData = data?.userData;
    // let parsedData = JSON.parse(userData);
    // console.log("i876redfghj", parsedData);
    // if (parsedData) {
    //   store.dispatch(setGymIdSelected(parsedData?.primaryGymData?._id));
    // }
  };
  return (
    <Provider store={store}>
      <NextUIProvider>
        <div>
          <Toaster />
        </div>

        <div className="flex flex-col">{children}</div>
      </NextUIProvider>
    </Provider>
  );
};

export default Providers;

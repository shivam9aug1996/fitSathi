"use client";

import React, { useLayoutEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

import { setAuth } from "../redux/features/authSlice";

import store from "../redux/store";

import { NextUIProvider } from "@nextui-org/react";

const Providers = ({ children, getCookies }: any) => {
  useLayoutEffect(() => {
    getCookie();
  }, []);
  const getCookie = async () => {
    let data = await getCookies();
    store.dispatch(setAuth(data));
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

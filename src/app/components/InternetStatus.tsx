"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useIsOnline } from "react-use-is-online";

const InternetStatus = () => {
  const { isOnline, isOffline, error } = useIsOnline();
  const [status, setIsStatus] = useState({
    isOnline: false,
    isOffline: false,
  });

  useEffect(() => {
    if (isOffline) {
      toast.error("Opps! Internet is disconnected");
      setIsStatus({ ...status, isOffline: true, isOnline: false });
    }
  }, [isOffline]);

  useEffect(() => {
    if (isOnline && status.isOffline === true) {
      toast.success("Hurray! Internet is connected");
      setIsStatus({ ...status, isOnline: true, isOffline: false });
    }
  }, [isOnline]);

  // useEffect(() => {
  //   if (error) {
  //     toast.error(error);
  //   }
  // }, [error]);

  return null;
};

export default InternetStatus;

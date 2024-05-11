"use client";
import Loader from "@/app/components/Loader";
import dynamic from "next/dynamic";
import React from "react";
// import PaymentList from "./PaymentList";
const PaymentList = dynamic(() => import("./PaymentList"), {
  ssr: false,
  loading: () => <Loader />,
});
const page = ({ params }) => {
  console.log("kjgffghjkldghj", params);
  return <PaymentList memberId={params?.memberId} />;
};

export default page;

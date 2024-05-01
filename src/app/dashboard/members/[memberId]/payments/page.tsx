"use client";
import React from "react";
import PaymentList from "./PaymentList";

const page = ({ params }) => {
  console.log("kjgffghjkldghj", params);
  return <PaymentList memberId={params?.memberId} />;
};

export default page;

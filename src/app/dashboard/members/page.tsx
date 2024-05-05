"use client";
import dynamic from "next/dynamic";
import React from "react";
const MemberList = dynamic(() => import("./MemberList"), {
  ssr: false,
});
const page = () => {
  return <MemberList />;
};

export default page;

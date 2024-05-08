// "use client";
import dynamic from "next/dynamic";
import React from "react";
// import MemberList from "./MemberList";
const MemberList = dynamic(() => import("./MemberList"), {
  ssr: false,
});
const page = () => {
  return <MemberList />;
};

export default page;

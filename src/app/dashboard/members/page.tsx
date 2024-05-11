// "use client";
import Loader from "@/app/components/Loader";
import TableLoader from "@/app/components/TableLoader";
import dynamic from "next/dynamic";
import React from "react";
// import MemberList from "./MemberList";
const MemberList = dynamic(() => import("./MemberList"), {
  ssr: false,
  loading: () => <Loader />,
});
const page = () => {
  return <MemberList />;
};

export default page;

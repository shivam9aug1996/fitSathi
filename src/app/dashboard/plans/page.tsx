import dynamic from "next/dynamic";
import React from "react";
import Loader from "./loading";
// import PlanList from "./PlanList";
const PlanList = dynamic(() => import("./PlanList"), {
  ssr: false,
  loading: () => <Loader />,
});
const page = () => {
  return <PlanList />;
};

export default page;

import dynamic from "next/dynamic";
import React from "react";
// import GymDashboard from "./GymDashboard";
const GymDashboard = dynamic(() => import("./GymDashboard"), {
  ssr: false,
});
const page = () => {
  return (
    <>
      {/* <GymList /> */}

      <GymDashboard />
    </>
  );
};

export default page;

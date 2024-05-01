import React from "react";
import CreateGym from "../components/CreateGym";
import Header from "../components/Header";
import GymDashboard from "./GymDashboard";
import GymList from "./GymList";

const page = () => {
  return (
    <>
      {/* <GymList /> */}

      <GymDashboard />
    </>
  );
};

export default page;

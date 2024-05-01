"use client";
import { Modal } from "@nextui-org/react";
import React, { useState } from "react";
import GymModal from "../dashboard/GymModal";
import PlanModal from "../dashboard/plans/PlanModal";

const AddPlan = () => {
  const [isModalOpen, setIsModalOpen] = useState({
    status: false,
    type: "",
    value: null,
  });
  return (
    <div className="flex flex-col items-center justify-center mt-36">
      <PlanModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <h2 className="text-2xl text-gray-700 text-center">
        Welcome to the Gym! Let's get started.
      </h2>
      <p className="text-lg text-gray-500 mt-2 text-center">
        {`You need to add at least one plan to start`}{" "}
      </p>
      <button
        onClick={() => {
          setIsModalOpen({
            ...isModalOpen,
            status: true,
            value: null,
            type: "add",
          });
        }}
        className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm focus:outline-none"
      >
        Add Plan
      </button>
    </div>
  );
};

export default AddPlan;

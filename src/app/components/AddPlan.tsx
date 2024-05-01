"use client";
import { Modal } from "@nextui-org/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import GymModal from "../dashboard/GymModal";
import PlanModal from "../dashboard/plans/PlanModal";

const AddPlan = () => {
  const selectedGym = useSelector((state) => state?.gym?.selectedGym);
  console.log("yfdfghjkl", selectedGym);
  const [isModalOpen, setIsModalOpen] = useState({
    status: false,
    type: "",
    value: null,
  });
  return (
    <div className="flex flex-col items-center justify-center mt-36">
      <PlanModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <h2 className=" text-gray-700 text-center" style={{ fontSize: 23 }}>
        Welcome to{" "}
        <span className="text-blue-600 font-bold">{selectedGym?.name}</span>
      </h2>
      <p className="text-lg text-gray-500 mt-2 text-center mx-5">
        Ready to streamline your gym operations? Let's dive into member
        management and payments!
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

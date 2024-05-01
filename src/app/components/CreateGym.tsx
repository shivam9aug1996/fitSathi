"use client";
import { Modal } from "@nextui-org/react";
import React, { useState } from "react";
import GymModal from "../dashboard/GymModal";

const CreateGym = () => {
  const [isModalOpen, setIsModalOpen] = useState({
    status: false,
    type: "",
    value: null,
  });
  return (
    <div className="flex flex-col items-center justify-center mt-36">
      <GymModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <h2 className="text-2xl text-gray-700 text-center">
        Welcome to the Fit Sathi! Let's get started.
      </h2>
      <p className="text-lg text-gray-500 mt-2 text-center">
        {`To manage gym, you need to add a gym.`}{" "}
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
        Add Gym
      </button>
    </div>
  );
};

export default CreateGym;

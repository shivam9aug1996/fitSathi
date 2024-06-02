"use client";
import Loader from "@/app/components/Loader";
import { useGetGymDataQuery } from "@/app/redux/features/attendanceSlice";
import { Button, Input, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const page = ({ params }) => {
  console.log("kjhgg", params);
  const { gymId } = params;
  const {
    isSuccess: isGetGymDataSuccess,
    isLoading: isGetDataGymLoading,
    isError: isGetDataGymError,
    error: getGymDataError,
    data: getGymData,
    isFetching,
  } = useGetGymDataQuery({ gymId }, { skip: !gymId });
  const router = useRouter();
  const { name = "", location = "" } = getGymData?.gymData || {};
  const [mobileNumber, setMobileNumber] = useState("");
  const handleMobileNumber = (e) => {
    setMobileNumber(e.target.value);
  };
  console.log("iuytrdfghj", getGymData);
  if (isGetDataGymError) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: "80vh" }}
      >
        <h4 className="font-bold">{"Something went wrong!!"}</h4>
      </div>
    );
  }
  if (isGetDataGymLoading) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: "80vh" }}
      >
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center flex-col gap-4 p-10">
      <h1>{name}</h1>
      <h1>{location}</h1>
      <Input
        value={mobileNumber}
        onChange={handleMobileNumber}
        type="mobileNumber"
        label="Mobile number"
        isRequired
        isClearable
        className="w-56"
        maxLength={10}
        onClear={() => setMobileNumber("")}
      />
      <Button
        onClick={() => {
          router.push(`/gym/attendance/${gymId}/${mobileNumber}`);
        }}
      >
        Submit
      </Button>
    </div>
  );
};

export default page;

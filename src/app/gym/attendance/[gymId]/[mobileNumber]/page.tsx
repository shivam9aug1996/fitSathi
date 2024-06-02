"use client";
import { formatDate, getCurrentDate } from "@/app/functions";
import {
  useGetGymDataQuery,
  useGetGymMemberDataQuery,
  useUpdateAttendanceMutation,
} from "@/app/redux/features/attendanceSlice";
import { Button, Card, Input, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const page = ({ params }) => {
  console.log("kjhgg", params);
  const { gymId, mobileNumber } = params;
  const {
    isSuccess: isGetGymDataSuccess,
    isLoading: isGetDataGymLoading,
    isError: isGetDataGymError,
    error: getGymDataError,
    data: getGymMemberData,
    isFetching,
  } = useGetGymMemberDataQuery(
    { gymId, mobileNumber },
    { skip: !gymId && !mobileNumber }
  );
  const [
    updateAttendance,
    {
      isSuccess: isUpdateAttendanceSuccess,
      isLoading: isUpdateAttendanceLoading,
      isError: isUpdateAttendanceError,
      error: updateAttendanceError,
      data: updateAttendanceData,
    },
  ] = useUpdateAttendanceMutation();
  const router = useRouter();
  const {
    gymData = null,
    memberData = null,
    attendanceData = null,
  } = getGymMemberData || {};

  console.log("iuytrdfghj", memberData);
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
  if (isUpdateAttendanceSuccess) {
    return (
      <div
        className="flex justify-center items-center text-center"
        style={{ height: "80vh" }}
      >
        <Card className="p-10">
          <h1>Attendance marked successfully</h1>
        </Card>
      </div>
    );
  }
  return (
    <div
      className="flex justify-center items-center flex-col gap-4 p-10 text-center"
      style={{ height: "80vh" }}
    >
      {memberData?.name && !attendanceData ? (
        <Card className="p-5 gap-3" style={{ width: "25%" }}>
          <h1>{memberData?.name}</h1>

          <Button
            onClick={() => {
              updateAttendance(
                JSON.stringify({
                  gymId,
                  memberId: memberData?._id,
                  date: getCurrentDate(),
                })
              );
            }}
            color="primary"
          >
            Present
          </Button>
        </Card>
      ) : attendanceData ? (
        <Card className="p-10">
          <h6>Hi, {memberData?.name}</h6>
          <h5>{`Attendance already marked for ${formatDate(new Date())}`}</h5>
        </Card>
      ) : null}
      {isGetDataGymError && (
        <Card className="p-10">
          <h1>{getGymDataError?.data?.message}</h1>
          <Button
            onClick={() => {
              router.push(`/gym/attendance/${gymId}`);
            }}
          >
            Try another number
          </Button>
        </Card>
      )}
    </div>
  );
};

export default page;

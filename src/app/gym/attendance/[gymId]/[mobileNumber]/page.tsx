"use client";
import { getCurrentDate } from "@/app/functions";
import {
  useGetGymDataQuery,
  useGetGymMemberDataQuery,
  useUpdateAttendanceMutation,
} from "@/app/redux/features/attendanceSlice";
import { Button, Input } from "@nextui-org/react";
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
  if (isUpdateAttendanceSuccess) {
    return <h1>Attendance marked successfully</h1>;
  }
  return (
    <>
      {memberData?.name && !attendanceData ? (
        <>
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
            color="success"
          >
            Present
          </Button>
        </>
      ) : attendanceData ? (
        <h1>attendance already marked</h1>
      ) : null}
      {isGetDataGymError && (
        <>
          <h1>{getGymDataError?.data?.message}</h1>
          <Button
            onClick={() => {
              router.push(`/gym/attendance/${gymId}`);
            }}
          >
            Try another number
          </Button>
        </>
      )}
    </>
  );
};

export default page;

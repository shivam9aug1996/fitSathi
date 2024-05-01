"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, Skeleton, Spinner } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import AddPlan from "../components/AddPlan";
import Back from "../components/Back";
import CreateGym from "../components/CreateGym";
import useErrorNotification from "../hooks/useErrorNotification";
import { useGetDashboardDetailsQuery } from "../redux/features/gymSlice";

const GymDashboard = () => {
  const selectedGymId = useSelector(
    (state) => state?.gym?.selectedGymId || null
  );
  const reduxStarted = useSelector((state) => state?.auth?.reduxStarted);
  const userId = useSelector((state) => state?.auth?.userData?.userId);
  const gymLoader = useSelector((state) => state?.gym?.gymLoader);

  const router = useRouter();
  const pathname = usePathname();

  const {
    isSuccess: isGetDashboardSuccess,
    isLoading: isGetDashboardLoading,
    isError: isGetDashboardError,
    error: getDashboardError,
    data: getDashboardData,
    isFetching,
  } = useGetDashboardDetailsQuery(
    { gymId: selectedGymId },
    { skip: !selectedGymId }
  );
  console.log("getDashboardData", getDashboardData);
  useErrorNotification(getDashboardError, isGetDashboardError);
  const { numPlans, numExpiredMembers, numActiveMembers } =
    getDashboardData || {};
  console.log("nhgfdfghjkl", selectedGymId, userId, isGetDashboardSuccess);
  return (
    <div>
      {reduxStarted && gymLoader === 2 ? (
        !selectedGymId && userId ? (
          <>
            <CreateGym />
          </>
        ) : selectedGymId && userId ? (
          isGetDashboardLoading ? (
            <div className="flex justify-center items-center mt-36">
              <Spinner label="Loading..." color="warning" />
            </div>
          ) : numPlans === 0 ? (
            <AddPlan />
          ) : (
            <div className="flex flex-wrap justify-center">
              <div
                className="w-full md:w-1/2 lg:w-1/3 p-4 transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => {
                  router.push("/dashboard/plans");
                }}
              >
                <div className="bg-blue-100 border border-blue-400 rounded-lg shadow-lg p-6  cursor-pointer">
                  <h2 className="text-xl font-semibold text-blue-700">
                    <div className="hover:text-blue-900">Number of Plans</div>
                  </h2>
                  {!isGetDashboardLoading && selectedGymId ? (
                    <p className="text-lg mt-2 flex flex-row">{numPlans}</p>
                  ) : (
                    <Skeleton
                      // isLoaded={!isGetDashboardLoading && selectedGymId}
                      className={"mt-2 bg-blue-300 rounded-xl h-8"}
                      style={{ width: "20%" }}
                    />
                  )}
                </div>
              </div>
              <div
                className="w-full md:w-1/2 lg:w-1/3 p-4 transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => {
                  router.push("/dashboard/members");
                }}
              >
                <div className="bg-green-100 border border-green-400 rounded-lg shadow-lg p-6 cursor-pointer">
                  <h2 className="text-xl font-semibold text-green-700">
                    <div className="hover:text-green-900">
                      Number of Members
                    </div>
                  </h2>
                  {!isGetDashboardLoading && selectedGymId ? (
                    <p className="text-lg mt-2 flex flex-row">
                      Active:{" "}
                      <span className="font-bold">{numActiveMembers}</span>,
                      Expired:{" "}
                      <span className="font-bold">{numExpiredMembers}</span>
                    </p>
                  ) : (
                    <Skeleton
                      // isLoaded={!isGetDashboardLoading && selectedGymId}
                      className={"mt-2 bg-green-300 rounded-xl h-8"}
                      style={{ width: "25%" }}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        ) : null
      ) : (
        <div className="flex justify-center items-center mt-36">
          <Spinner label="Loading..." color="warning" />
        </div>
      )}
    </div>
  );
};

export default GymDashboard;

"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, Skeleton, Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
// import AddPlan from "../components/AddPlan";
import Back from "../components/Back";
import Loader from "../components/Loader";
// import CreateGym from "../components/CreateGym";
const CreateGym = dynamic(() => import("../components/CreateGym"), {
  ssr: false,
});
const AddPlan = dynamic(() => import("../components/AddPlan"), {
  ssr: false,
});
import useErrorNotification from "../hooks/useErrorNotification";
import { useGetDashboardDetailsQuery } from "../redux/features/gymSlice";
import DashboardItemLoading from "./DashboardItemLoading";
import DashboardItem from "./DashboardItem";
// const DashboardItem = dynamic(() => import("./DashboardItem"), {
//   ssr: false,
//   loading: () => <DashboardItemLoading title={"Sample text"} />,
// });
import DashboardLoader from "./DashboardLoader";

const GymDashboard = () => {
  const selectedGymId = useSelector(
    (state) => state?.gym?.selectedGymId || null
  );
  // const selectedGymIdOnLogin = useSelector(
  //   (state) => state?.userData?.primaryGymData?._id || null
  // );
  // const isPlanPresent = useSelector(
  //   (state) => state?.userData?.primaryGymData?._id || null
  // );
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
  const {
    numPlans,
    numExpiredMembers,
    numActiveMembers,
    numExpiring1to3Days,
    numExpiring4to7Days,
    numExpiring8to15Days,
    totalAmountPaid,
  } = getDashboardData || {};
  console.log("nhgfdfghjkl", selectedGymId, userId, isGetDashboardSuccess);
  return (
    <div>
      {reduxStarted && gymLoader === 2 ? (
        !selectedGymId && userId ? (
          <>
            <CreateGym />
          </>
        ) : selectedGymId && userId ? (
          isGetDashboardLoading || isFetching ? (
            <DashboardLoader />
          ) : numPlans === 0 ? (
            <AddPlan />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
              <DashboardItem
                title={"Plans"}
                value={numPlans}
                onClick={() => router.push("/dashboard/plans")}
                href={"/dashboard/plans"}
              />
              <DashboardItem
                title={"Active Members"}
                value={numActiveMembers}
                onClick={() => router.push("/dashboard/members?isActive=true")}
                href={"/dashboard/members?isActive=true"}
              />
              <DashboardItem
                title={"Expired Members"}
                value={numExpiredMembers}
                onClick={() => router.push("/dashboard/members?isActive=false")}
                href={"/dashboard/members?isActive=false"}
              />
              <DashboardItem
                title={"Expiring Members in (1-3 days)"}
                value={numExpiring1to3Days}
                onClick={() =>
                  router.push(
                    "/dashboard/members?isActive=true&startRange=1&endRange=3"
                  )
                }
                href={
                  "/dashboard/members?isActive=true&startRange=1&endRange=3"
                }
              />
              <DashboardItem
                title={"Expiring Members in (4-7 days)"}
                value={numExpiring4to7Days}
                onClick={() =>
                  router.push(
                    "/dashboard/members?isActive=true&startRange=4&endRange=7"
                  )
                }
                href={
                  "/dashboard/members?isActive=true&startRange=4&endRange=7"
                }
              />
              <DashboardItem
                title={"Expiring members in (8-15 days)"}
                value={numExpiring8to15Days}
                onClick={() =>
                  router.push(
                    "/dashboard/members?isActive=true&startRange=8&endRange=15"
                  )
                }
                href={
                  "/dashboard/members?isActive=true&startRange=8&endRange=15"
                }
              />
              <DashboardItem
                title={"Amount Received"}
                value={totalAmountPaid}
                onClick={() => {}}
                type={"amount"}
              />
            </div>
          )
        ) : null
      ) : (
        // <div className="flex justify-center items-center mt-36">
        //   <Spinner label="Loading..." color="warning" />
        // </div>
        <DashboardLoader />
      )}
    </div>
  );
};

export default GymDashboard;

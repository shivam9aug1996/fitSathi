"use client";
import { useRouter } from "next/router";
import React from "react";
import DashboardItem from "./DashboardItem";

const GymDashboardItems = ({
  numPlans,
  numActiveMembers,
  numExpiredMembers,
  numExpiring1to3Days,
  numExpiring4to7Days,
  numExpiring8to15Days,
  totalAmountPaid,
}) => {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
      <DashboardItem
        title={"Plans"}
        value={numPlans}
        onClick={() => router.push("/dashboard/plans")}
      />
      <DashboardItem
        title={"Active Members"}
        value={numActiveMembers}
        onClick={() => router.push("/dashboard/members?isActive=true")}
      />
      <DashboardItem
        title={"Expired Members"}
        value={numExpiredMembers}
        onClick={() => router.push("/dashboard/members?isActive=false")}
      />
      <DashboardItem
        title={"Expiring Members in (1-3 days)"}
        value={numExpiring1to3Days}
        onClick={() =>
          router.push(
            "/dashboard/members?isActive=true&startRange=1&endRange=3"
          )
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
      />
      <DashboardItem
        title={"Expiring members in (8-15 days)"}
        value={numExpiring8to15Days}
        onClick={() =>
          router.push(
            "/dashboard/members?isActive=true&startRange=8&endRange=15"
          )
        }
      />
      <DashboardItem
        title={"Amount Received"}
        value={totalAmountPaid}
        onClick={() => {}}
        type={"amount"}
      />
    </div>
  );
};

export default GymDashboardItems;

import React from "react";
import DashboardItemLoading from "./DashboardItemLoading";

const DashboardLoader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
      <DashboardItemLoading title={"Plans"} value={""} onClick={() => {}} />
      <DashboardItemLoading
        title={"Active Members"}
        value={""}
        onClick={() => {}}
      />
      <DashboardItemLoading
        title={"Expired Members"}
        value={""}
        onClick={() => {}}
      />
      <DashboardItemLoading
        title={"Expiring Members in (1-3 days)"}
        value={""}
        onClick={() => {}}
      />
      <DashboardItemLoading
        title={"Expiring Members in (4-7 days)"}
        value={""}
        onClick={() => {}}
      />
      <DashboardItemLoading
        title={"Expiring members in (8-15 days)"}
        value={""}
        onClick={() => {}}
      />
      <DashboardItemLoading
        title={"Amount Received"}
        value={""}
        onClick={() => {}}
      />
    </div>
  );
};

export default DashboardLoader;

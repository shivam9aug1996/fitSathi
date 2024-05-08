import { Skeleton } from "@nextui-org/react";
import React from "react";
import { formattedValue } from "../functions";

const DashboardItemLoading = ({ title }) => {
  return (
    <div className="dashboard-item  bg-gray-100 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl hover:border-blue-500 transition duration-300 ease-in-out transform hover:scale-105 min-h-32 cursor-wait">
      <div className="flex w-full flex-col h-full justify-evenly items-center">
        <Skeleton className="text-lg font-semibold text-gray-800 text-center">
          <h2 className="text-lg font-semibold text-gray-800 text-center">
            {title}
          </h2>
        </Skeleton>
        <div className="flex items-center">
          <Skeleton className="w-10 h-10 flex items-center justify-center bg-blue-300 rounded-full mr-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-300 rounded-full mr-3">
              <p className={`font-bold text-white`}></p>
            </div>
          </Skeleton>
        </div>
      </div>
    </div>
  );
};

export default DashboardItemLoading;

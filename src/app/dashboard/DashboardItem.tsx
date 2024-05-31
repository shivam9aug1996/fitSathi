import { Skeleton } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { formattedValue } from "../functions";

const DashboardItem = ({ title, value, onClick, type = null, href = "" }) => {
  // Determine font size based on the length of the value
  const fontSize =
    value <= 99 ? "text-lg" : value > 99 && value < 999 ? "text-sm" : "text-xs";

  return (
    <Link href={href}>
      <div
        className="dashboard-item cursor-pointer bg-gray-100 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl hover:border-blue-500 transition duration-300 ease-in-out transform hover:scale-105 min-h-32"
        //onClick={onClick}
      >
        <div className="flex w-full flex-col h-full justify-evenly items-center">
          <h2 className="text-lg font-semibold text-gray-800 text-center">
            {title}
          </h2>

          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-300 rounded-full mr-3">
              <p className={`font-bold text-white ${fontSize}`}>
                {type === "amount" ? formattedValue(value) : value}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DashboardItem;

import { Skeleton } from "@nextui-org/react";
import React from "react";

const TableLoader = ({ wrapperStyle = {} }) => {
  return (
    <div
      className="flex flex-col w-full ml-4 mr-4 mt-20 bg-white"
      style={wrapperStyle}
    >
      <Skeleton style={{ height: 77.5 }} className="w-full" />
      <Skeleton style={{ height: 77.5 }} className="w-full mt-4" />
    </div>
  );
};

export default TableLoader;

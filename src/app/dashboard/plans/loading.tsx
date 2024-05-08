import { Skeleton } from "@nextui-org/react";
import React from "react";

const loading = () => {
  return (
    <div className="m-10">
      <Skeleton className="h-20 w-full mt-10" />
      <Skeleton className="h-20 w-full mt-10" />
    </div>
  );
};

export default loading;

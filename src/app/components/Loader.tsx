import { Skeleton } from "@nextui-org/react";
import React from "react";

const Loader = () => {
  return (
    <div className="m-10">
      <Skeleton className="h-20 w-full mt-10" />
      <Skeleton className="h-20 w-full mt-10" />
    </div>
  );
};

export default Loader;

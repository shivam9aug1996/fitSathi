import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/react";
import React from "react";

const Back = ({ onClick = () => {}, title = "Back" }) => {
  return (
    <Button onClick={onClick} className="m-4 w-min">
      <ArrowLeftIcon className="h5 w-5" />
      {title}
    </Button>
  );
};

export default Back;

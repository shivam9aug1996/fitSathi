import React, { useEffect, useState } from "react";
import { Kalam } from "next/font/google";
import { UserIcon } from "@heroicons/react/20/solid";
import { Image } from "@nextui-org/react";
const kalam = Kalam({ subsets: ["latin"], weight: "700" });

const Logo = ({ showImage = true }) => {
  return (
    <div className={`${kalam.className} flex items-center justify-center`}>
      {showImage && (
        <Image
          isBlurred
          src="/logo3.svg"
          alt="Logo"
          width={37}
          height={37}
          className={`pb-2`}
        />
      )}

      <h1
        className={`${
          showImage ? "logo" : ""
        } text-4xl font-bold text-gray-600 flex items-center ml-2`}
      >
        Fit
      </h1>

      <h1
        className={`${
          showImage ? "logo" : ""
        } text-4xl font-bold flex items-center ml-2`}
        style={{
          color: "rgb(175 121 149)",
          // transition: "opacity 0.5s ease-in-out",
        }}
      >
        Sathi
      </h1>
    </div>
  );
};

export default Logo;

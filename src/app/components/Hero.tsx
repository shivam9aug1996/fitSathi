"use client";
import { Button } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";
import Logo from "./Logo";
import Lottie1 from "./Lottie1";
const Params = dynamic(() => import("../components/Params"), {
  ssr: false,
});

const Hero = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center bg-white-100">
      <div
        style={{ backgroundColor: "rgb(255 248 248)" }}
        className=" py-12 px-4 sm:px-6 lg:px-8 text-center w-full"
      >
        <Logo showImage={false} />
        <p className="mt-4 text-lg leading-6 text-gray-500">
          Streamline Your Fitness Business, Effortlessly.
        </p>

        <Button
          onClick={() => router.push("/login")}
          className="mt-5"
          variant="flat"
          color="primary"
          size="lg"
        >
          Get Started Now
        </Button>
      </div>
      <Params />
      <Lottie1 />
    </div>
  );
};

export default Hero;

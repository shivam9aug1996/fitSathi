"use client";
import { Button } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { deleteCookies } from "../actions";
import Logo from "./Logo";
import Lottie1 from "./Lottie1";

const Hero = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    const search = searchParams.get("message");
    deleteCookies();

    if (search == "logout") {
      router.refresh();
    }
  }, [router, searchParams, pathname]);
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
      <Lottie1 />
    </div>
  );
};

export default Hero;

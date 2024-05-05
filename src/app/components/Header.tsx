"use client";
import { Button, Skeleton } from "@nextui-org/react";
import { cookies } from "next/headers";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GymList from "../dashboard/GymList";
import { isDateInRange } from "../functions";
import { authApi, useLogoutMutation } from "../redux/features/authSlice";
import { gymApi } from "../redux/features/gymSlice";
import { memberApi } from "../redux/features/memberSlice";
import { paymentApi } from "../redux/features/paymentSlice";
import { planApi } from "../redux/features/planSlice";
import HeaderNavLink from "./HeaderNavLink";
import Logo from "./Logo";

const Header = () => {
  const router = useRouter();
  const userId = useSelector((state) => state?.auth?.userData?.userId);
  const reduxStarted = useSelector((state) => state?.auth?.reduxStarted);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [
    logout,
    {
      isSuccess: isLogoutSuccess,
      isLoading: isLogoutLoading,
      isError: isLogoutError,
      error: logoutError,
      data: logoutData,
    },
  ] = useLogoutMutation();
  useEffect(() => {
    console.log("o87654edfghj", isDateInRange("2024-05-07", "2024-05-08"));
    if (isLogoutSuccess) {
      // window.location.href("/");
      router.replace("/");
      // setTimeout(() => {
      //   router.refresh();
      // }, 2000);
      // window.location.href =
      //   window.location.hostname +
      //   `/login?message=${encodeURIComponent("token not exists")}`;
    }
  }, [isLogoutSuccess]);

  return (
    // <div className="flex space-x-2">
    //   <Link href={"/"}>Home</Link>
    //   <Link href={"/login"}>Login</Link>
    //   <Link href={"/signup"}>Signup</Link>
    //   <button
    //     onClick={() => {
    //       logout()
    //         .unwrap()
    //         .then(() => {
    //           router.push("/");
    //         });
    //     }}
    //   >
    //     logout
    //   </button>
    // </div>
    <div
      className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-center items-start sticky top-0"
      style={{ zIndex: 1 }}
    >
      <div className="flex flex-row items-center justify-between w-full">
        <Link
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center cursor-pointer"
          href="/"
        >
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          {reduxStarted ? (
            !userId ? (
              <>
                <HeaderNavLink title={"Home"} path={"/"} />
                <HeaderNavLink title={"Login"} path={"/login"} />
                <HeaderNavLink title={"Signup"} path={"/signup"} />
              </>
            ) : (
              <div className="flex flex-col">
                <GymList logout={logout} isLogoutLoading={isLogoutLoading} />
              </div>
            )
          ) : pathname.includes("/dashboard") ? (
            <div className="flex flex-col">
              <GymList logout={logout} isLogoutLoading={isLogoutLoading} />
            </div>
          ) : (
            <>
              <HeaderNavLink title={"Home"} path={"/"} />
              <HeaderNavLink title={"Login"} path={"/login"} />
              <HeaderNavLink title={"Signup"} path={"/signup"} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

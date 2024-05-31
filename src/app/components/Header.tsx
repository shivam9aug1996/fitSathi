"use client";
import { Button, Skeleton } from "@nextui-org/react";
import { cookies } from "next/headers";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCookies } from "../actions";
import GymList from "../dashboard/GymList";
import { isDateInRange } from "../functions";
import useErrorNotification from "../hooks/useErrorNotification";
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
  useErrorNotification(logoutError, isLogoutError);
  // useEffect(() => {
  //   console.log("o87654edfghj", isDateInRange("2024-05-06", "2024-05-08"));
  //   if (isLogoutSuccess) {
  //     deleteCookies();
  //     setTimeout(() => {
  //       console.log("8765r887654567876567865678fgh");
  //       router.push(`/?message=logout`);
  //     }, 500);
  //     // router.push(`/login?message=logout`);
  //     //window.location.href = `/login?message=logout`;
  //     //  window.location.replace("/");
  //   }
  // }, [isLogoutSuccess]);

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
          href={userId ? "/dashboard" : "/"}
          replace
        >
          <Logo />
        </Link>
        {/* <div
          className="cursor-pointer"
          onClick={() => {
            userId ? router.push("/dashboard") : router.push("/");
          }}
        >
          <Logo />
        </div> */}
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

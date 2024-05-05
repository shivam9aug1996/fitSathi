"use client";
// import FitSathiLogo from "@/app/clientComponents/FitSathiLogo";
// import Lottie2 from "@/app/clientComponents/Lottie2";
// import useErrorNotification from "@/app/custom-hooks/useErrorNotification";
import {
  setAuthLoader,
  useLoginMutation,
} from "@/app/redux/features/authSlice";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Lottie2 from "../components/Lottie2";
import useErrorNotification from "../hooks/useErrorNotification";
import { setGymIdSelected } from "../redux/features/gymSlice";

const TrainerLogin = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    mobileNumber: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { data, isLoading, isSuccess, isError, error: loginError }] =
    useLoginMutation();
  useErrorNotification(loginError, isError);

  // useErrorNotification(loginError, isError);

  // useEffect(() => {
  //   if (isSuccess) {
  //     dispatch(setAuthLoader(true));
  //     router.replace("/trainer/dashboard");
  //   }
  // }, [isSuccess]);

  const handleMobileNumber = (e) => {
    setError({ ...error, mobileNumber: "" });
    setMobileNumber(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setError({ ...error, password: "" });
  };

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form submission
    if (mobileNumber.trim() === "") {
      toast.error("Please fill in mobile number.");
      return;
    }
    if (password.trim() === "") {
      toast.error("Please fill in password.");
      return;
    }
    // Check if mobile number is a valid Indian mobile number
    const mobileNumberRegex = /^[6-9]\d{9}$/;
    if (!mobileNumber.match(mobileNumberRegex)) {
      toast.error("Please enter a valid Indian mobile number");

      return;
    }

    // Check if mobile number has a length of 10 digits
    if (mobileNumber.length !== 10) {
      toast.error("Mobile number should be 10 digits long");

      return;
    }
    if (password.length < 4) {
      toast.error("Password should be at least 4 characters long");

      return;
    }
    console.log("Form submitted successfully");
    login(
      JSON.stringify({
        mobileNumber,
        password,
      })
    )
      ?.unwrap()
      .then((res) => {
        router.replace("/dashboard");
        console.log("i8765redfghjk", res?.userData?.primaryGymData?._id);
        // if (res?.userData?.primaryGymData?._id)
        dispatch(setGymIdSelected(res?.userData?.primaryGymData?._id));
      });
  };

  return (
    <div className="flex flex-col  items-center justify-center bg-gradient-to-r from-orange-100 to-red-100 h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 sm:w-96 mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <form
          autoComplete="off"
          onSubmit={handleLogin}
          className="flex flex-col space-y-4"
        >
          <input
            autoComplete="false"
            name="hidden"
            type="text"
            style={{ display: "none" }}
          />

          <Input
            autoComplete="false"
            value={mobileNumber}
            onChange={handleMobileNumber}
            type="mobileNumber"
            label="Mobile number"
            isRequired
            isClearable
            className="w-full"
            // isInvalid={!!error.mobileNumber}
            // errorMessage={error.mobileNumber}
            onClear={() => setMobileNumber("")}
            maxLength={10}
          />
          <Input
            autoComplete="false"
            value={password}
            onChange={handlePassword}
            type="password"
            label="Password"
            isRequired
            isClearable
            className="w-full"
            // isInvalid={!!error.password}
            // errorMessage={error.password}
            onClear={() => setPassword("")}
          />
          <Button
            isLoading={isLoading}
            onClick={handleLogin}
            type="submit"
            color="primary"
          >
            Login
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account?</span>

          <Link className="text-blue-600 ml-2" href="/signup">
            Sign Up
          </Link>
        </div>
        <Lottie2 />
      </div>
    </div>
  );
};

export default TrainerLogin;

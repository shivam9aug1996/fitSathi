"use client";
import Lottie2 from "@/app/components/Lottie2";
// import FitSathiLogo from "@/app/clientComponents/FitSathiLogo";
// import Lottie2 from "@/app/clientComponents/Lottie2";
// import useErrorNotification from "@/app/custom-hooks/useErrorNotification";
import {
  setAuthLoader,
  useLoginMutation,
  useSignupMutation,
} from "@/app/redux/features/authSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import useErrorNotification from "../hooks/useErrorNotification";

const Signup = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    mobileNumber: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const [signup, { data, isLoading, isSuccess, isError, error: loginError }] =
    useSignupMutation();
  useErrorNotification(loginError, isError);
  const [isVisible, setIsVisible] = useState(false);
  // useErrorNotification(loginError, isError);

  // useEffect(() => {
  //   if (isSuccess) {
  //     dispatch(setAuthLoader(true));
  //     router.replace("/trainer/dashboard");
  //   }
  // }, [isSuccess]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!mobileNumber.trim()) {
      errors.mobileNumber = "Mobile number is required";
      isValid = false;
    } else if (!password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleMobileNumber = (e) => {
    setError({ ...error, mobileNumber: "" });
    setMobileNumber(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setError({ ...error, password: "" });
  };
  const handleSignup = (e) => {
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
    signup(
      JSON.stringify({
        mobileNumber,
        password,
      })
    )
      ?.unwrap()
      .then(() => {
        router.replace("/dashboard");
      });
  };

  return (
    <div className="flex flex-col  items-center justify-center bg-gradient-to-r from-orange-100 to-red-100 h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 sm:w-96 mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Sign Up
        </h2>
        <form
          autoComplete="off"
          onSubmit={handleSignup}
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
            maxLength={10}
            onClear={() => setMobileNumber("")}
          />
          <Input
            autoComplete="false"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={handlePassword}
            type={isVisible ? "text" : "password"}
            label="Password"
            isRequired
            className="w-full"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {!isVisible ? (
                  <EyeSlashIcon className="h-5 w-5 pointer-events-none" />
                ) : (
                  <EyeIcon className="h-5 w-5 pointer-events-none" />
                )}
              </button>
            }
          />
          <Button
            isLoading={isLoading}
            onClick={handleSignup}
            type="submit"
            color="primary"
          >
            Sign Up
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account?</span>
          <Link className="text-blue-600 ml-2" href="/login">
            Login
          </Link>
        </div>
        <Lottie2 />
      </div>
    </div>
  );
};

export default Signup;

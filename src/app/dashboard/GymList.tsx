"use client";
import { Button, Divider, Select, SelectItem, user } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  gymApi,
  setGymIdSelected,
  useDeleteGymMutation,
  useGetGymListQuery,
  useUpdateGymMutation,
} from "../redux/features/gymSlice";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import GymModal from "./GymModal";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "../redux/features/authSlice";
import useErrorNotification from "../hooks/useErrorNotification";
import DeleteModal from "../components/DeleteModal";

const GymList = ({ logout, isLogoutLoading }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = useSelector((state) => state?.auth?.userData?.userId || null);
  const [selectedGymId, setSelectedGymId] = useState("");
  const [selectedGym, setSelectedGym] = useState("");
  const [isModalOpen, setIsModalOpen] = useState({
    status: false,
    type: "",
    value: null,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({
    status: false,
    type: "",
    value: null,
  });
  console.log("mjhgfdsdfghjk", selectedGym, selectedGymId);
  const {
    isSuccess: isGetGymSuccess,
    isLoading: isGetGymLoading,
    isError: isGetGymError,
    error: getGymError,
    data: getGymData,
    isFetching,
  } = useGetGymListQuery({ userId: userId }, { skip: !userId });
  const [
    updateGym,
    {
      isSuccess: isUpdateGymSuccess,
      isLoading: isUpdateGymLoading,
      isError: isUpdateGymError,
      error: updateGymError,
      data: updateGymData,
    },
  ] = useUpdateGymMutation();
  // const [
  //   logout,
  //   {
  //     isSuccess: isLogoutSuccess,
  //     isLoading: isLogoutLoading,
  //     isError: isLogoutError,
  //     error: logoutError,
  //     data: logoutData,
  //   },
  // ] = useLogoutMutation();
  const [
    deleteGym,
    {
      isSuccess: isDeleteGymSuccess,
      isLoading: isDeleteGymLoading,
      isError: isDeleteGymError,
      error: deleteGymError,
      data: deleteGymData,
    },
  ] = useDeleteGymMutation();
  useErrorNotification(deleteGymError, isDeleteGymError);
  useErrorNotification(updateGymError, isUpdateGymError);
  useErrorNotification(getGymError, isGetGymError);

  console.log("sdfghj", getGymData);
  const { gyms } = getGymData || [];

  // useEffect(() => {
  //   if (isLogoutSuccess) {
  //     setTimeout(() => {
  //       window.location.href("/");
  //     }, 2000);
  //     // router.replace("/");
  //     //router.push("/kjhgfd");
  //   }
  // }, [isLogoutSuccess]);

  useEffect(() => {
    if (isGetGymSuccess) {
      for (const gym of gyms) {
        // Check if the gym is primary
        if (gym.isPrimary === true) {
          console.log("iuy6789");
          setSelectedGymId(gym?._id);
          setSelectedGym(gym);
          dispatch(setGymIdSelected(gym?._id));
          //return gym; // Return the primary gym
        }
      }
      // if (gyms?.length === 0) {
      //   dispatch(setGymIdSelected(""));
      // }
    }
  }, [isGetGymSuccess, getGymData]);

  useEffect(() => {
    if (isDeleteGymSuccess || isUpdateGymSuccess) {
      dispatch(gymApi.util.resetApiState());
      // dispatch(gymApi.util.invalidateTags(["gymList"]));
      // dispatch(gymApi.util.resetApiState());
      // setTimeout(() => {
      //   dispatch(gymApi.util.invalidateTags(["gymList"]));
      //   //dispatch(gymApi.util.invalidateTags(["dashboard"]));
      // }, 1000);
      // setTimeout(() => {
      router.replace("/dashboard");
      // }, 800);

      setIsDeleteModalOpen({
        ...isDeleteModalOpen,
        status: false,
      });
    }
  }, [isDeleteGymSuccess, isUpdateGymSuccess]);

  const handleSelectionChange = (e) => {
    console.log(e.target);
    if (e.target.value !== "Add gym") {
      updateGym(
        JSON.stringify({
          id: e?.target?.value,
          userId: userId,
          isPrimary: true,
        })
      );
      setSelectedGymId(e?.target?.value);
      // dispatch(setGymIdSelected(e?.target?.value));
    }
  };
  return (
    <>
      <GymModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <DeleteModal
        isLoading={isDeleteGymLoading}
        title={"Delete Gym"}
        subtitle={
          "Deleting this item will remove it permanently, along with all associated member records and their payments. Are you sure you want to continue?"
        }
        isModalOpen={isDeleteModalOpen}
        setIsModalOpen={setIsDeleteModalOpen}
        handleDelete={() => {
          deleteGym(
            JSON.stringify({
              id: selectedGymId,
              userId: userId,
            })
          );
        }}
      />
      <div className="flex" style={{ minWidth: 150, maxWidth: 150 }}>
        <Select
          label="Select a Gym"
          className="max-w-xs"
          isLoading={isFetching || isUpdateGymLoading}
          isDisabled={isGetGymLoading || isUpdateGymLoading}
          onChange={handleSelectionChange}
          selectedKeys={[selectedGymId]}
        >
          {gyms?.map((gym) => (
            <SelectItem key={gym?._id} value={gym?._id}>
              {gym?.name}
            </SelectItem>
          ))}

          <SelectItem
            key={"Add gym"}
            onClick={() => {
              setIsModalOpen({
                ...isModalOpen,
                status: true,
                type: "add",
                value: null,
              });
            }}
          >
            {/* <Divider className="bg-black mb-3" /> */}
            <div className="flex-row flex justify-center">
              <p>{"Add Gym"}</p>
              <PlusIcon className="w-5 h-5" />
            </div>
          </SelectItem>
        </Select>
      </div>
      <div className="flex flex-row justify-end items-center gap-2 mt-2">
        {gyms?.length > 0 ? (
          <>
            <PencilSquareIcon
              onClick={(e) => {
                setIsModalOpen({
                  ...isModalOpen,
                  status: true,
                  type: "edit",
                  value: selectedGym,
                });
              }}
              className="w-5 h-5 text-gray-500 hover:text-cyan-500 cursor-pointer "
            />
            <TrashIcon
              onClick={(e) => {
                setIsDeleteModalOpen({
                  ...isDeleteModalOpen,
                  status: true,
                });
              }}
              className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
            />
          </>
        ) : null}
        <Button
          className="ml-4"
          variant={"flat"}
          size={"sm"}
          color="primary"
          isLoading={isLogoutLoading}
          onClick={() => {
            logout()
              .unwrap()
              .then(() => {});
          }}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default GymList;

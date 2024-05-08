"use client";
import useErrorNotification from "@/app/hooks/useErrorNotification";
import { gymApi } from "@/app/redux/features/gymSlice";
import {
  useCreateMemberMutation,
  useUpdateMemberMutation,
} from "@/app/redux/features/memberSlice";
import {
  useCreatePlanMutation,
  useGetPlanListQuery,
  useUpdatePlanMutation,
} from "@/app/redux/features/planSlice";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export const MembershipModal = ({ isModalOpen, setIsModalOpen }) => {
  const userId = useSelector((state) => state?.auth?.userData?.userId || null);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const selectedGymId = useSelector((state) => state?.gym?.selectedGymId || "");
  const router = useRouter();
  console.log("higfdfgh", selectedGymId);
  const [
    createMember,
    {
      isSuccess: isCreateMemberSuccess,
      isLoading: isCreateMemberLoading,
      isError: isCreateMemberError,
      error: createMemberError,
      data: createMemberData,
    },
  ] = useCreateMemberMutation();
  const [
    updateMember,
    {
      isSuccess: isUpdateMemberSuccess,
      isLoading: isUpdateMemberLoading,
      isError: isUpdateMemberError,
      error: updateMemberError,
      data: updateMemberData,
    },
  ] = useUpdateMemberMutation();

  const {
    isSuccess: isGetPlanSuccess,
    isLoading: isGetPlanLoading,
    isError: isGetPlanError,
    error: getPlanError,
    data: getPlanData,
  } = useGetPlanListQuery(
    {
      gymId: selectedGymId,
    },
    { skip: !selectedGymId }
  );
  useErrorNotification(createMemberError, isCreateMemberError);
  useErrorNotification(updateMemberError, isUpdateMemberError);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobileNumber: "",
  });
  const [value, setValue] = useState("");

  useEffect(() => {
    if (isCreateMemberSuccess || isUpdateMemberSuccess) {
      dispatch(gymApi.util.invalidateTags(["dashboard"]));
      if (isCreateMemberSuccess) {
        router.replace("/dashboard/members?isActive=false");
      }
      closeModal();
    }
  }, [isCreateMemberSuccess, isUpdateMemberSuccess]);
  console.log(isModalOpen, value);

  useEffect(() => {
    if (getPlanData?.plans?.length > 0) {
      console.log("iuytfghjk", isModalOpen?.value?.planId);
      setValue(isModalOpen?.value?.planId?.toString());
    }
  }, [getPlanData, isModalOpen]);

  useEffect(() => {
    if (
      isModalOpen?.value &&
      isModalOpen?.type === "edit" &&
      isModalOpen?.status === true
    ) {
      setFormData({
        name: isModalOpen?.value?.name,
        address: isModalOpen?.value?.address,
        mobileNumber: isModalOpen?.value?.mobileNumber,
      });
    } else {
      setFormData({
        name: "",
        address: "",
        mobileNumber: "",
      });
      setValue("");
    }
  }, [isModalOpen]);
  // useEffect(() => {
  //   if (isCreateMemberLoading || isUpdateMemberLoading) {
  //     closeModal();
  //   }
  // }, [isCreateMemberLoading, isUpdateMemberLoading]);

  function closeModal() {
    setFormData({
      name: "",
      address: "",
      mobileNumber: "",
    });
    setValue("");
    setIsModalOpen({ ...isModalOpen, status: false, value: null });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    // Handle form submission logic here

    const { name, mobileNumber, address } = formData;
    if (name.trim() === "") {
      toast.error("Please fill in name.");
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

    if (address.trim() === "") {
      toast.error("Please fill in address.");
      return;
    }

    if (!value) {
      toast.error("Please select a plan.");
      return;
    }

    if (isModalOpen?.type == "edit") {
      updateMember(
        JSON.stringify({
          memberId: isModalOpen?.value?._id,
          name: formData?.name,
          mobileNumber: formData?.mobileNumber,
          address: formData?.address,
          planId: value,
        })
      );
    } else {
      createMember(
        JSON.stringify({
          name: formData?.name,
          mobileNumber: formData?.mobileNumber,
          address: formData?.address,
          gymId: selectedGymId,
          planId: value,
        })
      );
    }

    // Close modal after form submission
  }
  console.log(formData);

  const handleSelectionChange = (e) => {
    console.log(e.target);
    setValue(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Modal
          isOpen={isModalOpen?.status}
          placement={"center"}
          onOpenChange={(e) =>
            setIsModalOpen({
              ...isModalOpen,
              status: e,
            })
          }
          isDismissable={false}
          style={{ minHeight: 500 }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {isModalOpen?.type === "edit"
                    ? "Update Member"
                    : "Add Member"}
                </ModalHeader>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-4 flex-1"
                >
                  <ModalBody>
                    <Input
                      value={formData.name}
                      onChange={handleChange}
                      name="name"
                      type="text"
                      label="Name"
                      isRequired
                      className="w-full"
                      isClearable
                      onClear={() => setFormData({ ...formData, name: "" })}
                    />
                    <Input
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      name="mobileNumber"
                      type="tel"
                      label="MobileNumber"
                      isRequired
                      className="w-full"
                      isClearable
                      onClear={() =>
                        setFormData({ ...formData, mobileNumber: "" })
                      }
                      maxLength={10}
                    />
                    <Input
                      value={formData.address}
                      onChange={handleChange}
                      name="address"
                      type="text"
                      label="Address"
                      isRequired
                      className="w-full"
                      isClearable
                      onClear={() => setFormData({ ...formData, address: "" })}
                    />
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                      <Select
                        isRequired
                        label="Select a Plan"
                        className="max-w-xs"
                        // isLoading={isFetching || isUpdateGymLoading}
                        // isDisabled={isGetGymLoading || isUpdateGymLoading}
                        onChange={handleSelectionChange}
                        selectedKeys={[value]}
                      >
                        {getPlanData?.plans?.map((gym) => (
                          <SelectItem key={gym?._id} value={gym?._id}>
                            {gym?.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </ModalBody>

                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      isLoading={isUpdateMemberLoading || isCreateMemberLoading}
                      color="primary"
                      type="submit"
                    >
                      {isModalOpen?.type === "edit"
                        ? "Update Member"
                        : "Add Member"}
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default memo(MembershipModal);

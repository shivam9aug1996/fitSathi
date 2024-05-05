"use client";
import { getCurrentDate } from "@/app/functions";
import useErrorNotification from "@/app/hooks/useErrorNotification";
import { gymApi } from "@/app/redux/features/gymSlice";
import {
  memberApi,
  useCreateMemberMutation,
  useUpdateMemberMutation,
} from "@/app/redux/features/memberSlice";
import {
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
} from "@/app/redux/features/paymentSlice";
import {
  useCreatePlanMutation,
  useGetPlanListQuery,
  useUpdatePlanMutation,
} from "@/app/redux/features/planSlice";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  parseDate,
  parseAbsoluteToLocal,
  parseDateTime,
} from "@internationalized/date";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import moment from "moment";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export const PaymentModal = ({ isModalOpen, setIsModalOpen }) => {
  const userId = useSelector((state) => state?.auth?.userData?.userId || null);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const selectedGymId = useSelector((state) => state?.gym?.selectedGymId || "");
  const router = useRouter();
  console.log("higfdfgh", selectedGymId);
  const [
    createPayment,
    {
      isSuccess: isCreatePaymentSuccess,
      isLoading: isCreatePaymentLoading,
      isError: isCreatePaymentError,
      error: createPaymentError,
      data: createPaymentData,
    },
  ] = useCreatePaymentMutation();
  const [
    updatePayment,
    {
      isSuccess: isUpdatePaymentSuccess,
      isLoading: isUpdatePaymentLoading,
      isError: isUpdatePaymentError,
      error: updatePaymentError,
      data: updatePaymentData,
    },
  ] = useUpdatePaymentMutation();
  useErrorNotification(createPaymentError, isCreatePaymentError);
  useErrorNotification(updatePaymentError, isUpdatePaymentError);

  // const {
  //   isSuccess: isGetPlanSuccess,
  //   isLoading: isGetPlanLoading,
  //   isError: isGetPlanError,
  //   error: getPlanError,
  //   data: getPlanData,
  // } = useGetPlanListQuery(
  //   {
  //     gymId: selectedGymId,
  //   },
  //   { skip: !selectedGymId }
  // );

  const [formData, setFormData] = useState({
    startDate: getCurrentDate(),
    endDate: getCurrentDate(),
    amountPaid: "",
    amountDue: "",
    paymentDate: getCurrentDate(),
  });
  const [value, setValue] = useState("");
  console.log("jhgfdfghjkl", "2021-04-07");
  useEffect(() => {
    if (isCreatePaymentSuccess || isUpdatePaymentSuccess) {
      dispatch(memberApi.util.invalidateTags(["memberList"]));
      dispatch(gymApi.util.invalidateTags(["dashboard"]));
      closeModal();
      console.log("o987654edfghjkl");
      // setTimeout(() => {
      //   closeModal();
      // }, 500);
    }
  }, [isCreatePaymentSuccess, isUpdatePaymentSuccess]);
  console.log(isModalOpen, value);

  // useEffect(() => {
  //   if (getPlanData?.plans?.length > 0) {
  //     console.log("iuytfghjk", isModalOpen?.value?.planId);
  //     setValue(isModalOpen?.value?.planId?.toString());
  //   }
  // }, [getPlanData, isModalOpen]);

  useEffect(() => {
    if (
      isModalOpen?.value &&
      isModalOpen?.type === "edit" &&
      isModalOpen?.status === true
    ) {
      setFormData({
        startDate: isModalOpen?.value?.startDate,
        endDate: isModalOpen?.value?.endDate,
        amountPaid: isModalOpen?.value?.amountPaid,
        amountDue: isModalOpen?.value?.amountDue,
        paymentDate: isModalOpen?.value?.paymentDate,
      });
    } else {
      setFormData({
        startDate: getCurrentDate(),
        endDate: getCurrentDate(30),
        amountPaid: "",
        amountDue: "",
        paymentDate: getCurrentDate(),
      });
      setValue("");
    }
  }, [isModalOpen]);
  // useEffect(() => {
  //   if (isCreatePaymentLoading || isUpdatePaymentLoading) {
  //     closeModal();
  //   }
  // }, [isCreatePaymentLoading, isUpdatePaymentLoading]);

  function closeModal() {
    setFormData({
      startDate: "",
      endDate: "",
      amountPaid: "",
      amountDue: "",
      paymentDate: "",
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
  console.log("kjhgfdfghjkl;", formData);

  function handleSubmit(e) {
    e.preventDefault();
    // Handle form submission logic here

    const { amountDue, amountPaid } = formData;

    const startDate = moment(formData.startDate);
    const endDate = moment(formData.endDate);

    if (endDate.isSameOrAfter(startDate)) {
      console.log("endDate is greater than or equal to startDate");
    } else {
      toast.error("Please enter End date greater than or equal to Start date");
      return;
    }

    if (parseInt(amountDue) < 0) {
      toast.error("Please enter amount due greater than 0");
      return;
    }
    if (parseInt(amountPaid) < 0) {
      toast.error("Please enter amount paid greater than 0");
      return;
    }

    if (isModalOpen?.type == "edit") {
      // console.log({
      //   memberId: isModalOpen?.value?.memberId,
      //   paymentId: isModalOpen?.value?._id,
      //   startDate: formData?.startDate,
      //   endDate: formData?.endDate,
      //   amountPaid: formData?.amountPaid,
      //   amountDue: formData?.amountDue,
      //   paymentDate: formData?.paymentDate,
      // });
      updatePayment(
        JSON.stringify({
          memberId: isModalOpen?.value?.memberId,
          paymentId: isModalOpen?.value?._id,
          startDate: formData?.startDate,
          endDate: formData?.endDate,
          amountPaid: formData?.amountPaid,
          amountDue: formData?.amountDue,
          paymentDate: formData?.paymentDate,
        })
      );
    } else {
      // console.log(
      //   JSON.stringify({
      //     memberId: isModalOpen?.value?.memberId,
      //     startDate: formData?.startDate,
      //     endDate: formData?.endDate,
      //     amountPaid: formData?.amountPaid,
      //     amountDue: formData?.amountDue,
      //     paymentDate: formData?.paymentDate,
      //   })
      // );
      createPayment(
        JSON.stringify({
          memberId: isModalOpen?.value?.memberId,
          startDate: formData?.startDate,
          endDate: formData?.endDate,
          amountPaid: formData?.amountPaid,
          amountDue: formData?.amountDue,
          paymentDate: formData?.paymentDate,
          gymId: selectedGymId,
        })
      );
    }

    // Close modal after form submission
  }
  console.log(formData);

  const handleSelectionChange = (e) => {
    console.log(e.target);
    setValue(e.target.value);
    // if (e.target.value !== "Add gym") {
    //   updateMember(
    //     JSON.stringify({
    //       id: e?.target?.value,
    //       userId: userId,
    //       isPrimary: true,
    //     })
    //   );
    //   setSelectedGymId(e?.target?.value);
    //   dispatch(setGymIdSelected(e?.target?.value));
    // }
  };

  const handleStartDateChange = (e) => {
    console.log("jhgfghj", e);
    setFormData({ ...formData, startDate: e?.target?.value });
  };
  const handleEndDateChange = (e) => {
    setFormData({ ...formData, endDate: e?.target?.value });
  };

  const handlePaymentDateChange = (e) => {
    setFormData({ ...formData, paymentDate: e?.target?.value });
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
                    ? "Update Payment"
                    : "Add Payment"}
                </ModalHeader>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-4 flex-1"
                >
                  <ModalBody>
                    {/* <Input
                      value={formData.startDate}
                      onChange={handleChange}
                      name="name"
                      type="text"
                      label="Name"
                      isRequired
                      className="w-full"
                    /> */}

                    <div className="py-2 px-3 bg-default-100 rounded-xl  gap-0 justify-center items-start  h-14 tap-highlight-transparent shadow-sm  focus-within:hover:bg-default-100 text-foreground-500 outline-none">
                      <span
                        id="react-aria1234639891-:r1c:"
                        data-slot="label"
                        className="block text-default-600 text-tiny"
                      >
                        Start Date
                      </span>
                      <input
                        className="w-full bg-default-100 cursor-text outline-none"
                        type="date"
                        id="date"
                        value={formData.startDate}
                        onChange={handleStartDateChange}
                        required
                      />
                    </div>

                    <div className="py-2 px-3 bg-default-100 rounded-xl  gap-0 justify-center items-start  h-14 tap-highlight-transparent shadow-sm  focus-within:hover:bg-default-100 text-foreground-500 outline-none">
                      <span
                        id="react-aria1234639891-:r1c:"
                        data-slot="label"
                        className="block text-default-600 text-tiny"
                      >
                        End Date
                      </span>
                      <input
                        className="w-full bg-default-100 cursor-text outline-none"
                        type="date"
                        id="date"
                        value={formData.endDate}
                        onChange={handleEndDateChange}
                        required
                      />
                    </div>

                    {/* <DatePicker
                      className="max-w-[284px]"
                      label="Date (controlled)"
                      // value={formData.startDate}
                      // onChange={handleStartDateChange}
                    /> */}

                    {/* <DatePicker
                      className="max-w-[284px]"
                      label="Date (controlled)"
                      value={formData.endDate}
                      onChange={handleStartDateChange}
                    /> */}
                    <Input
                      value={formData.amountPaid}
                      onChange={handleChange}
                      name="amountPaid"
                      type="number"
                      label="Amount Paid"
                      isRequired
                      className="w-full"
                      isClearable
                      onClear={() =>
                        setFormData({ ...formData, amountPaid: "" })
                      }
                    />
                    <Input
                      value={formData.amountDue}
                      onChange={handleChange}
                      name="amountDue"
                      type="number"
                      label="Amount Due"
                      isRequired
                      className="w-full"
                      isClearable
                      onClear={() =>
                        setFormData({ ...formData, amountDue: "" })
                      }
                    />
                    <div className="py-2 px-3 bg-default-100 rounded-xl  gap-0 justify-center items-start  h-14 tap-highlight-transparent shadow-sm  focus-within:hover:bg-default-100 text-foreground-500 outline-none">
                      <span
                        id="react-aria1234639891-:r1c:"
                        data-slot="label"
                        className="block text-default-600 text-tiny"
                      >
                        Payment Date
                      </span>
                      <input
                        className="w-full bg-default-100 cursor-text outline-none"
                        type="date"
                        id="date"
                        value={formData.paymentDate}
                        onChange={handlePaymentDateChange}
                        required
                      />
                    </div>
                    {/* <DatePicker
                      className="max-w-[284px]"
                      label="Date (controlled)"
                      value={formData.paymentDate}
                      onChange={handlePaymentDateChange}
                    /> */}
                  </ModalBody>

                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      isLoading={
                        isUpdatePaymentLoading || isCreatePaymentLoading
                      }
                      color="primary"
                      type="submit"
                    >
                      {isModalOpen?.type === "edit"
                        ? "Update Payment"
                        : "Add Payment"}
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

export default memo(PaymentModal);

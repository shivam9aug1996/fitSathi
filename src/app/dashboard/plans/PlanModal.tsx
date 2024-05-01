"use client";
import useErrorNotification from "@/app/hooks/useErrorNotification";
import { gymApi } from "@/app/redux/features/gymSlice";
import {
  useCreatePlanMutation,
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
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export const PlaModal = ({ isModalOpen, setIsModalOpen }) => {
  const userId = useSelector((state) => state?.auth?.userData?.userId || null);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const selectedGymId = useSelector((state) => state?.gym?.selectedGymId || "");
  const router = useRouter();
  console.log("higfdfgh", selectedGymId);
  const [
    createPlan,
    {
      isSuccess: isCreatePlanSuccess,
      isLoading: isCreatePlanLoading,
      isError: isCreatePlanError,
      error: createPlanError,
      data: createPlanData,
    },
  ] = useCreatePlanMutation();
  const [
    updatePlan,
    {
      isSuccess: isUpdatePlanSuccess,
      isLoading: isUpdatePlanLoading,
      isError: isUpdatePlanError,
      error: updatePlanError,
      data: updatePlanData,
    },
  ] = useUpdatePlanMutation();
  useErrorNotification(createPlanError, isCreatePlanError);
  useErrorNotification(updatePlanError, isUpdatePlanError);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
  });

  // useEffect(() => {
  //   if (isCreateBusinessSuccess) {
  //     if (pathname.includes("customers")) {
  //       router.push("/dashboard/customers");
  //     } else {
  //       router.push("/dashboard/suppliers");
  //     }
  //   }
  // }, [isCreateBusinessSuccess]);
  useEffect(() => {
    if (isCreatePlanSuccess || isUpdatePlanSuccess) {
      dispatch(gymApi.util.invalidateTags(["dashboard"]));
      closeModal();
    }
  }, [isCreatePlanSuccess, isUpdatePlanSuccess]);
  console.log(isModalOpen);
  useEffect(() => {
    if (
      isModalOpen?.value &&
      isModalOpen?.type === "edit" &&
      isModalOpen?.status === true
    ) {
      setFormData({
        name: isModalOpen?.value?.name,
        price: isModalOpen?.value?.price,
        duration: isModalOpen?.value?.duration,
        description: isModalOpen?.value?.description,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        duration: "",
        description: "",
      });
    }
  }, [isModalOpen]);
  //let [isOpen, setIsOpen] = useState(true);
  // useEffect(() => {
  //   if (isCreatePlanLoading || isUpdatePlanLoading) {
  //     closeModal();
  //   }
  // }, [isCreatePlanLoading, isUpdatePlanLoading]);

  function closeModal() {
    setFormData({
      name: "",
      price: "",
      duration: "",
      description: "",
    });
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
    const { name, price, duration } = formData;

    if (name.trim() === "") {
      toast.error("Please fill in name.");
      return;
    }
    if (parseInt(price) < 0) {
      toast.error("Please enter price greater than 0");
      return;
    }
    if (parseInt(duration) < 0) {
      toast.error("Please enter duration greater than 0");
      return;
    }

    if (isModalOpen?.type == "edit") {
      updatePlan(
        JSON.stringify({
          id: isModalOpen?.value?._id,
          name: formData?.name,
          price: formData?.price,
          duration: formData?.duration,
          description: formData?.description,
        })
      );
    } else {
      createPlan(
        JSON.stringify({
          name: formData?.name,
          price: formData?.price,
          duration: formData?.duration,
          description: formData?.description,
          gymId: selectedGymId,
        })
      );
    }

    // Close modal after form submission
  }
  console.log(formData);

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
                  {isModalOpen?.type === "edit" ? "Update Plan" : "Add Plan"}
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
                      value={formData.price}
                      onChange={handleChange}
                      name="price"
                      type="number"
                      label="Price"
                      isRequired
                      className="w-full"
                      isClearable
                      onClear={() => setFormData({ ...formData, price: "" })}
                    />
                    <Input
                      value={formData.duration}
                      onChange={handleChange}
                      name="duration"
                      type="number"
                      label="Duration (in days)"
                      isRequired
                      className="w-full"
                      isClearable
                      onClear={() => setFormData({ ...formData, duration: "" })}
                    />
                    <Input
                      value={formData.description}
                      onChange={handleChange}
                      name="description"
                      type="text"
                      label="Description"
                      className="w-full"
                      isClearable
                      onClear={() =>
                        setFormData({ ...formData, description: "" })
                      }
                    />
                  </ModalBody>

                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      isLoading={isUpdatePlanLoading || isCreatePlanLoading}
                      color="primary"
                      type="submit"
                    >
                      {isModalOpen?.type === "edit"
                        ? "Update Plan"
                        : "Add Plan"}
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

export default memo(PlaModal);

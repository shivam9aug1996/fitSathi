"use client";
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
import useErrorNotification from "../hooks/useErrorNotification";
import {
  gymApi,
  useCreateGymMutation,
  useDeleteGymMutation,
  useUpdateGymMutation,
} from "../redux/features/gymSlice";

export const GymModal = ({ isModalOpen, setIsModalOpen }) => {
  const userId = useSelector((state) => state?.auth?.userData?.userId || null);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const selectedGymId = useSelector((state) => state?.gym?.selectedGymId || "");
  const router = useRouter();
  console.log("higfdfgh", selectedGymId);
  const [
    createGym,
    {
      isSuccess: isCreateGymSuccess,
      isLoading: isCreateGymLoading,
      isError: isCreateGymError,
      error: createGymError,
      data: createGymData,
    },
  ] = useCreateGymMutation();
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
  useErrorNotification(createGymError, isCreateGymError);
  useErrorNotification(updateGymError, isUpdateGymError);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  useEffect(() => {
    if (isCreateGymSuccess) {
      router.replace("/dashboard");
      dispatch(gymApi.util.resetApiState());

      closeModal();
    }
  }, [isCreateGymSuccess]);
  useEffect(() => {
    if (isUpdateGymSuccess) {
      closeModal();
    }
  }, [isUpdateGymSuccess]);
  console.log("kjhfghjkl", isUpdateGymSuccess);
  // useEffect(() => {
  //   if (isCreateBusinessSuccess) {
  //     if (pathname.includes("customers")) {
  //       router.push("/dashboard/customers");
  //     } else {
  //       router.push("/dashboard/suppliers");
  //     }
  //   }
  // }, [isCreateBusinessSuccess]);
  console.log(isModalOpen);
  useEffect(() => {
    if (
      isModalOpen?.value &&
      isModalOpen?.type === "edit" &&
      isModalOpen?.status === true
    ) {
      setFormData({
        name: isModalOpen?.value?.name,
        location: isModalOpen?.value?.location,
      });
    } else {
      setFormData({
        name: "",
        location: "",
      });
    }
  }, [isModalOpen]);
  //let [isOpen, setIsOpen] = useState(true);
  // useEffect(() => {
  //   if (isCreateGymLoading || isUpdateGymLoading) {
  //     closeModal();
  //   }
  // }, [isCreateGymLoading, isUpdateGymLoading]);

  function closeModal() {
    setFormData({
      name: "",
      location: "",
    });
    setIsModalOpen({ ...isModalOpen, status: false });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleValidation = () => {
    const { location, name } = formData;

    if (location.trim() === "" || name.trim() === "") {
      toast.error("Please fill in all fields");

      return;
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    // Handle form submission logic here
    const { location, name } = formData;

    if (name.trim() === "") {
      toast.error("Please fill in name.");
      return;
    }
    if (location.trim() === "") {
      toast.error("Please fill in location.");
      return;
    }

    if (isModalOpen?.type == "edit") {
      updateGym(
        JSON.stringify({
          id: isModalOpen?.value?._id,
          name: formData.name,
          location: formData?.location,
          userId: isModalOpen?.value?.userId,
        })
      );
    } else {
      createGym(
        JSON.stringify({
          name: formData?.name,
          location: formData?.location,
          userId: userId,
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
          // style={{ minHeight: 500 }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {isModalOpen?.type === "edit" ? "Update Gym" : "Add Gym"}
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
                      className="w-full"
                      isClearable
                      onClear={() => setFormData({ ...formData, name: "" })}
                      isRequired
                    />
                    <Input
                      value={formData.location}
                      onChange={handleChange}
                      name="location"
                      type="text"
                      label="Location"
                      className="w-full"
                      isClearable
                      onClear={() => setFormData({ ...formData, location: "" })}
                      isRequired
                    />
                  </ModalBody>

                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      isLoading={isUpdateGymLoading || isCreateGymLoading}
                      color="primary"
                      type="submit"
                    >
                      {isModalOpen?.type === "edit" ? "Update Gym" : "Add Gym"}
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

export default memo(GymModal);

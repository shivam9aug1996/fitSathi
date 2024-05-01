import React from "react";
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

const DeleteModal = ({
  title,
  subtitle,
  isModalOpen,
  setIsModalOpen,
  handleDelete,
  isLoading,
}) => {
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
          //style={{ minHeight: 500 }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {title}
                </ModalHeader>

                <ModalBody>
                  <p className="text-sm text-gray-600 mt-3">{subtitle}</p>
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    isLoading={isLoading}
                    color="danger"
                    onClick={() => {
                      handleDelete();
                    }}
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default DeleteModal;

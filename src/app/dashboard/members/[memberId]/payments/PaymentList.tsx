"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spinner,
  Tooltip,
  Input,
  Skeleton,
  Card,
} from "@nextui-org/react";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  useDeletePlanMutation,
  useGetPlanListQuery,
} from "@/app/redux/features/planSlice";
// import PlanModal from "./PlanModal";
import { gymApi } from "@/app/redux/features/gymSlice";
import {
  memberApi,
  useDeleteMemberMutation,
  useGetMemberListQuery,
} from "@/app/redux/features/memberSlice";
// import MembershipModal from "./MembershipModal";
import { useRouter } from "next/navigation";
import {
  useDeletePaymentMutation,
  useGetPaymentListQuery,
} from "@/app/redux/features/paymentSlice";
import PaymentModal from "./PaymentModal";
import { formatDate } from "@/app/functions";
import Back from "@/app/components/Back";
import TableLoader from "@/app/components/TableLoader";
import DeleteModal from "@/app/components/DeleteModal";
import useErrorNotification from "@/app/hooks/useErrorNotification";

const headerColumns = [
  { name: "START DATE" },
  // { name: "MOBILE NUMBER" },
  // { name: "ADDRESS" },
  { name: "END DATE" },
  // { name: "START DATE" },
  // { name: "END DATE", sortable: true },
  // { name: "AMOUNT DUE", sortable: true },
  { name: "AMOUNT PAID" },
  { name: "AMOUNT DUE" },
  { name: "PAYMENT DATE" },
  { name: "ACTIONS" },
];

const PaymentList = ({ memberId }) => {
  const gymLoader = useSelector((state) => state?.gym?.gymLoader);

  const gymId = useSelector((state) => state?.gym?.selectedGymId || null);
  const [filterValue, setFilterValue] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });
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
  const [
    deletePayment,
    {
      data: deletePaymentData,
      isError: isDeletePaymentError,
      error: deletePaymentError,
      isLoading: isDeletePaymentLoading,
      isSuccess: isDeletePaymentSuccess,
    },
  ] = useDeletePaymentMutation();

  const {
    isSuccess: isGetPaymentSuccess,
    isLoading: isGetPaymentLoading,
    isError: isGetPaymentError,
    error: getPaymentError,
    data: getPaymentData,
  } = useGetPaymentListQuery(
    {
      memberId: memberId,
    },
    { skip: !gymId }
  );
  useErrorNotification(deletePaymentError, isDeletePaymentError);
  useErrorNotification(getPaymentError, isGetPaymentError);
  console.log("uyrfghjk", gymId);
  useEffect(() => {
    if (isDeletePaymentSuccess) {
      dispatch(memberApi.util.invalidateTags(["memberList"]));
      dispatch(gymApi.util.invalidateTags(["dashboard"]));
      setIsDeleteModalOpen({
        ...isDeleteModalOpen,
        status: false,
        value: null,
      });
    }
  }, [isDeletePaymentSuccess]);

  useEffect(() => {
    if (gymLoader === 2) {
      if (!gymId) {
        router.back();
      }
    }
  }, [gymLoader, gymId]);

  const hasSearchFilter = Boolean(filterValue);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);
  console.log("jhgffghj", isModalOpen);

  const filteredItems = useMemo(() => {
    let filteredData = [...(getPaymentData?.payments ?? [])];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredData;
  }, [getPaymentData, filterValue]);
  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-end gap-3 items-end">
          {/* <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={
              <MagnifyingGlassIcon className="text-default-300 h-5" />
            }
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          /> */}
          <div className="flex gap-3">
            <Button
              className="bg-foreground text-background"
              endContent={<PlusIcon className="h-5" />}
              size="sm"
              onClick={() => {
                setIsModalOpen({
                  status: true,
                  value: { memberId: memberId },
                  type: "add",
                });
              }}
            >
              Add Payment
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, getPaymentData, hasSearchFilter]);

  const sortedItems = React.useMemo(() => {
    return [...(filteredItems ?? [])].sort((a, b) => {
      console.log(a);
      const first = a[sortDescriptor.column?.toLocaleLowerCase()];
      const second = b[sortDescriptor.column?.toLocaleLowerCase()];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      console.log(first, second);
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);
  console.log(sortDescriptor);

  function daysUntilExpiration(date) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const expirationDate = new Date(date);
    expirationDate.setHours(0, 0, 0, 0);

    // Calculate the difference in milliseconds
    const difference = expirationDate.getTime() - currentDate.getTime();

    // Convert milliseconds to days
    const daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (daysDifference > 0) {
      return daysDifference; // Return days left until expiration
    } else {
      return daysDifference; // Return days passed since expiration
    }
  }

  return (
    <div className="ml-4 mr-4">
      {/* <PlanModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /> */}
      {/* <MembershipModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      /> */}
      <DeleteModal
        isLoading={isDeletePaymentLoading}
        title={"Delete Payment"}
        subtitle={
          "Deleting this item will remove it permanently. Are you sure you want to continue?"
        }
        isModalOpen={isDeleteModalOpen}
        setIsModalOpen={setIsDeleteModalOpen}
        handleDelete={() => {
          deletePayment(
            JSON.stringify({
              paymentId: isDeleteModalOpen?.value,
            })
          );
        }}
      />

      <PaymentModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <Back
        title="Members"
        onClick={() => {
          router.back();
        }}
      />
      <Table
        isCompact={true}
        topContent={topContent}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        classNames={{
          table: "min-h-[250px]",
        }}
        isHeaderSticky
        aria-label="Plan List"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.name} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={
            sortedItems?.length === 0 && isGetPaymentSuccess
              ? "No data found"
              : ""
          }
          isLoading={isGetPaymentLoading || !gymId}
          loadingContent={<TableLoader />}
          items={sortedItems ?? []}
        >
          {(item) => {
            console.log(item);
            return (
              <TableRow key={item?._id}>
                {/* <TableCell>{item?.name}</TableCell> */}
                <TableCell>
                  {formatDate(item?.startDate, "DD MMMM, YY")}
                </TableCell>
                <TableCell>
                  {formatDate(item?.endDate, "DD MMMM, YY")}
                </TableCell>
                <TableCell>{"₹ " + item?.amountPaid}</TableCell>
                <TableCell>{"₹ " + item?.amountDue}</TableCell>
                <TableCell>
                  {formatDate(item?.paymentDate, "DD MMMM, YY")}
                </TableCell>
                {/* <TableCell>
                  {daysUntilExpiration(item?.latestPayment?.endDate) >= 0
                    ? "Active"
                    : "Expired"}
                </TableCell> */}
                {/* <TableCell>{item?.latestPayment?.startDate}</TableCell>
                <TableCell>{item?.latestPayment?.endDate}</TableCell>
                <TableCell>{item?.latestPayment?.amountDue}</TableCell> */}
                {/* <TableCell
                  onClick={() => {
                    router.push(`/dashboard/members/${item?._id}/payments`);
                  }}
                >
                  {"View"}
                </TableCell> */}
                <TableCell>
                  <div className="flex flex-row gap-2">
                    {/* <span
                      onClick={() => {
                        deleteMember(
                          JSON.stringify({
                            id: item?._id,
                          })
                        );
                      }}
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    >
                      <EyeIcon className="h-5" />
                    </span> */}
                    <span
                      onClick={() => {
                        setIsModalOpen({
                          status: true,
                          value: { ...item, memberId: memberId },
                          type: "edit",
                        });
                      }}
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    >
                      <PencilSquareIcon className="h-5" />
                    </span>
                    <span
                      onClick={() => {
                        setIsDeleteModalOpen({
                          ...isDeleteModalOpen,
                          status: true,
                          value: item?._id,
                        });
                      }}
                      className="text-lg text-default-400  cursor-pointer active:opacity-50"
                    >
                      <TrashIcon className="h-5" />
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentList;

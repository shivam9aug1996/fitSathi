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
  Chip,
} from "@nextui-org/react";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRightIcon,
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
  useDeleteMemberMutation,
  useGetMemberListQuery,
} from "@/app/redux/features/memberSlice";
import MembershipModal from "./MembershipModal";
import { useRouter } from "next/navigation";
import {
  getDateDifferenceFromToday,
  getDifferenceInDays,
} from "@/app/functions";
import Back from "@/app/components/Back";
import TableLoader from "@/app/components/TableLoader";
import DeleteModal from "@/app/components/DeleteModal";
import useErrorNotification from "@/app/hooks/useErrorNotification";

const headerColumns = [
  { name: "NAME", sortable: true },
  // { name: "MOBILE NUMBER" },
  // { name: "ADDRESS" },
  { name: "STATUS" },
  // { name: "START DATE" },
  { name: "DAYS LEFT" },
  { name: "AMOUNT DUE" },

  { name: "ACTIONS" },
  { name: "PAYMENTS" },
];

const MemberList = () => {
  const gymId = useSelector((state) => state?.gym?.selectedGymId || null);
  const gymLoader = useSelector((state) => state?.gym?.gymLoader);

  const [filterValue, setFilterValue] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
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
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });
  const [
    deleteMember,
    {
      data: deleteMemberData,
      isError: isDeleteMemberError,
      error: deleteMemberError,
      isLoading: isDeleteMemberLoading,
      isSuccess: isDeleteMemberSuccess,
    },
  ] = useDeleteMemberMutation();

  const {
    isSuccess: isGetMemberSuccess,
    isLoading: isGetMemberLoading,
    isError: isGetMemberError,
    error: getMemberError,
    data: getMemberData,
  } = useGetMemberListQuery(
    {
      gymId: gymId,
    },
    { skip: !gymId }
  );
  console.log("uyrfghjk", gymId);
  useErrorNotification(deleteMemberError, isDeleteMemberError);
  useErrorNotification(getMemberError, isGetMemberError);

  useEffect(() => {
    if (gymLoader === 2) {
      if (!gymId) {
        router.back();
      }
    }
  }, [gymLoader, gymId]);

  useEffect(() => {
    if (isDeleteMemberSuccess) {
      dispatch(gymApi.util.invalidateTags(["dashboard"]));
      setIsDeleteModalOpen({
        ...isDeleteModalOpen,
        status: false,
        value: null,
      });
    }
  }, [isDeleteMemberSuccess]);

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
    let filteredData = [...(getMemberData?.members ?? [])];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredData;
  }, [getMemberData, filterValue]);
  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
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
          />
          <div className="flex gap-3">
            <Button
              className="bg-foreground text-background"
              endContent={<PlusIcon className="h-5" />}
              size="sm"
              onClick={() => {
                setIsModalOpen({
                  status: true,
                  value: null,
                  type: "add",
                });
              }}
            >
              Add Member
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, getMemberData, hasSearchFilter]);

  const sortedItems = React.useMemo(() => {
    return [...(filteredItems ?? [])].sort((a, b) => {
      console.log(
        "mjhgf5678dsdfghjk",
        a,
        sortDescriptor.column?.toLocaleLowerCase(),
        a[sortDescriptor.column?.toLocaleLowerCase()]
      );
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
      <MembershipModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <DeleteModal
        isLoading={isDeleteMemberLoading}
        title={"Delete Member"}
        subtitle={
          "Deleting this item will remove it permanently, along with all associated payments. Are you sure you want to continue?"
        }
        isModalOpen={isDeleteModalOpen}
        setIsModalOpen={setIsDeleteModalOpen}
        handleDelete={() => {
          deleteMember(
            JSON.stringify({
              memberId: isDeleteModalOpen?.value,
            })
          );
        }}
      />
      <Back
        title="Dashboard"
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
            sortedItems?.length === 0 && isGetMemberSuccess
              ? "No data found"
              : ""
          }
          isLoading={isGetMemberLoading || !gymId}
          loadingContent={<TableLoader />}
          items={sortedItems ?? []}
        >
          {(item) => {
            console.log(item);
            return (
              <TableRow key={item?._id}>
                <TableCell>{item?.name}</TableCell>
                {/* <TableCell>{item?.mobileNumber}</TableCell>
                <TableCell>{item?.address}</TableCell> */}
                <TableCell>
                  {
                    <Chip
                      className="capitalize"
                      color={
                        daysUntilExpiration(item?.latestPayment?.endDate) >= 0
                          ? "success"
                          : "danger"
                      }
                      size="md"
                      variant="flat"
                    >
                      {daysUntilExpiration(item?.latestPayment?.endDate) >= 0
                        ? "Active"
                        : "Expired"}
                    </Chip>
                  }
                </TableCell>
                {/* <TableCell>{item?.latestPayment?.startDate}</TableCell> */}
                <TableCell>
                  {/* {item?.latestPayment
                    ? `${item?.latestPayment?.startDate} -
                    ${item?.latestPayment?.endDate}`
                    : "N/A"} */}
                  {item?.latestPayment
                    ? getDifferenceInDays(item?.latestPayment?.endDate) +
                      " days"
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {item?.latestPayment
                    ? "₹ " + item?.latestPayment?.amountDue
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2">
                    <span
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
                    </span>
                    <span
                      onClick={() => {
                        setIsModalOpen({
                          status: true,
                          value: item,
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
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                    >
                      <TrashIcon className="h-5" />
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => {
                      router.push(`/dashboard/members/${item?._id}/payments`);
                    }}
                  >
                    {"Go to"}
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
};

export default MemberList;

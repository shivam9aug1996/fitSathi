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
import PlanModal from "./PlanModal";
import { gymApi } from "@/app/redux/features/gymSlice";
import Back from "@/app/components/Back";
import { useRouter } from "next/navigation";
import TableLoader from "@/app/components/TableLoader";
import DeleteModal from "@/app/components/DeleteModal";
import useErrorNotification from "@/app/hooks/useErrorNotification";

const headerColumns = [
  { name: "NAME", sortable: true },
  { name: "PRICE", sortable: true },
  { name: "DURATION", sortable: true },
  { name: "ACTIONS" },
];

const PlanList = () => {
  const router = useRouter();
  const gymLoader = useSelector((state) => state?.gym?.gymLoader);

  const gymId = useSelector((state) => state?.gym?.selectedGymId || null);
  const [filterValue, setFilterValue] = useState("");
  const dispatch = useDispatch();

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
    deletePlan,
    {
      data: deletePlanData,
      isError: isDeletePlanError,
      error: deletePlanError,
      isLoading: isDeletePlanLoading,
      isSuccess: isDeletePlanSuccess,
    },
  ] = useDeletePlanMutation();

  const {
    isSuccess: isGetPlanSuccess,
    isLoading: isGetPlanLoading,
    isError: isGetPlanError,
    error: getPlanError,
    data: getPlanData,
  } = useGetPlanListQuery(
    {
      gymId: gymId,
    },
    { skip: !gymId }
  );
  useErrorNotification(getPlanError, isGetPlanError);
  useErrorNotification(deletePlanError, isDeletePlanError);

  useEffect(() => {
    if (isDeletePlanSuccess) {
      dispatch(gymApi.util.invalidateTags(["dashboard"]));
      setIsDeleteModalOpen({
        ...isDeleteModalOpen,
        status: false,
        value: null,
      });
    }
  }, [isDeletePlanSuccess]);

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
    let filteredData = [...(getPlanData?.plans ?? [])];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredData;
  }, [getPlanData, filterValue]);
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
              Add Plan
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, getPlanData, hasSearchFilter]);

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

  return (
    <div className="ml-4 mr-4">
      {/* <PlanModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /> */}
      <PlanModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <DeleteModal
        isLoading={isDeletePlanLoading}
        title={"Delete Plan"}
        subtitle={
          "Deleting this item will remove it permanently. Are you sure you want to continue?"
        }
        isModalOpen={isDeleteModalOpen}
        setIsModalOpen={setIsDeleteModalOpen}
        handleDelete={() => {
          deletePlan(
            JSON.stringify({
              id: isDeleteModalOpen?.value,
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
            sortedItems?.length === 0 && isGetPlanSuccess ? "No data found" : ""
          }
          isLoading={isGetPlanLoading || !gymId}
          loadingContent={<TableLoader />}
          items={sortedItems ?? []}
        >
          {(item) => {
            console.log(item);
            return (
              <TableRow key={item?._id}>
                <TableCell>{item?.name}</TableCell>
                <TableCell>{"₹ " + item?.price}</TableCell>
                <TableCell>{item?.duration + " " + "days"}</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2">
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
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlanList;

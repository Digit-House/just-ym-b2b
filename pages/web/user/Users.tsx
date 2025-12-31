"use client";

import React, { useState, useCallback, useEffect } from "react";
import Pagination from "@/components/Pagination";
import UsersStats from "./_components/UsersStats";
import UsersFilterBar from "./_components/UsersFilterBar";
import UsersTable from "./_components/UsersTable";
import ModalWrapper from "@/components/ModalWrapper";
import UserForm from "./_components/UserForm";
import { UserRolesFilterT, UserRoleT } from "@/types/user.type";
import { getAllUsers,postUser } from "@/graphql/user";
import { UserFormValues } from "@/types/schema/userSchema";
import { toast } from "sonner";
import { useUser } from "@/provider/UserProvider";

const UsersManagement = () => {
  const {user} = useUser();
  const [userRoles, setUserRoles] = useState<UserRoleT[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [query, setQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [filterData, setFilterData] = useState<UserRolesFilterT>({
    page: 1,
    limit: 10,
    orderBy: {
      dir: "desc",
    },
    resellerId: user?.id,
  });

  const [modalState, setModalState] = useState<{
    mode: "add" | "edit" | "delete" | null;
    user?: UserRoleT | null;
  }>({
    mode: null,
    user: null,
  });

  const onPageChange = (newPage: number) => {
    setFilterData((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  useEffect(() => {
    fetchUserRoles();
  }, [isFetching, filterData]);

  const fetchUserRoles = async () => {
    try {
      const res: any = await getAllUsers(filterData);
      setUserRoles(res.data.findAllUsers.data);
      setTotal(res.data.findAllUsers.total);
    } catch (err) {
      console.error(err);
    }
  };

  // Modal actions
  const openAddModal = useCallback(() => {
    setModalState({ mode: "add" });
  }, []);

  const openEditModal = useCallback((user: UserRoleT) => {
    setModalState({ mode: "edit", user });
  }, []);

  const openDeleteModal = useCallback((user: UserRoleT) => {
    setModalState({ mode: "delete", user });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ mode: null, user: null });
  }, []);

  const createUser = async (data: UserFormValues) => {
    try {
      setSubmitLoading(true);
      const res = await postUser(data);
      console.log(res,"84")
      toast.success("User created successfully");
      setIsFetching((prev) => !prev);
      setModalState({ mode: null, user: null });
    } catch (err) {
      throw err;
    } finally {
      setSubmitLoading(false);
    }
  };

  const editUser = async (data: UserFormValues) => {};

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 text-sm">
          Measure your advertising ROI and report website traffic.
        </p>
      </header>

      <UsersStats />
      <UsersFilterBar
        searchTerm={query}
        onSearch={setQuery}
        onAdd={openAddModal}
      />

      <UsersTable
        users={userRoles}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      <Pagination
        page={filterData.page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setFilterData((prev) => ({
            ...prev,
            page: 1,
          }));
        }}
      />

      {/* ------------------- Modals ------------------- */}

      {/* Add Modal */}
      {modalState.mode === "add" && (
        <ModalWrapper
          title="Add User"
          onClose={closeModal}
          children={
            <UserForm
              mode="create"
              loading={submitLoading}
              onCancel={closeModal}
              onSubmit={createUser}
            />
          }
        />
      )}

      {/* Edit Modal */}
      {modalState.mode === "edit" && modalState.user && (
        <ModalWrapper
          title="Edit User"
          onClose={closeModal}
          children={
            <UserForm
              mode="edit"
              loading={submitLoading}
              initialValues={modalState.user}
              onCancel={closeModal}
              onSubmit={async () => closeModal()}
            />
          }
        />
      )}

      {/* Delete Confirmation */}
      {modalState.mode === "delete" && modalState.user && (
        <ModalWrapper
          title="Delete User?"
          onClose={closeModal}
          children={
            <p className="text-slate-500 text-center">
              Are you sure you want to delete{" "}
              <b className="text-slate-800">{modalState.user.name}</b>? This
              action cannot be undone.
            </p>
          }
          footer={
            <button
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg"
              onClick={() => {
                closeModal();
              }}
            >
              Delete
            </button>
          }
        />
      )}
    </div>
  );
};

export default UsersManagement;

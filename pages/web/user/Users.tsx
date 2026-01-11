"use client";

import { useState, useCallback, useEffect } from "react";
import Pagination from "@/components/Pagination";
import UsersStats from "./_components/UsersStats";
import UsersFilterBar from "./_components/UsersFilterBar";
import UsersTable from "./_components/UsersTable";
import ModalWrapper from "@/components/ModalWrapper";
import UserForm from "./_components/UserForm";
import { UserManagementT, UserRolesFilterT} from "@/types/user.type";
import { getAllUsers, postUser, updateUser } from "@/graphql/user";
import { UserFormValues } from "@/types/schema/userSchema";
import { toast } from "sonner";
import { useUser } from "@/provider/UserProvider";
import DeleteModal from "@/components/DeleteModal";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";

const UsersManagement = () => {
  const { user } = useUser();
  const [userRoles, setUserRoles] = useState<UserManagementT[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [deletModal, setDeleteModal] = useState(false);

  const [userStats, setUserStats] = useState({
    userCount: 0,
    activeCount: 0,
    adminCount: 0,
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const [filterData, setFilterData] = useState<UserRolesFilterT>({
    active: true,
    page: 1,
    limit: 10,
    orderBy: {
      dir: "desc",
    },
    resellerId: null,
    type: null,
  });

  const [modalState, setModalState] = useState<{
    mode: "add" | "edit" | "delete" | null;
    user?: UserManagementT | null;
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
      setUserStats({
        userCount: res.data.findAllUsers.userCount,
        activeCount: res.data.findAllUsers.activeCount,
        adminCount: res.data.findAllUsers.adminCount,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Modal actions
  const openAddModal = useCallback(() => {
    setModalState({ mode: "add" });
  }, []);

  const openEditModal = useCallback((user: UserManagementT) => {
    setModalState({ mode: "edit", user });
  }, []);

  const openDeleteModal = useCallback((user: UserManagementT) => {
    setModalState({ mode: "delete", user });
    setDeleteModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ mode: null, user: null });
  }, []);

  const createUser = async (data: UserFormValues) => {
    try {
      setSubmitLoading(true);
      await postUser(data);
      toast.success("User created successfully");
      setIsFetching((prev) => !prev);
      setModalState({ mode: null, user: null });
    } catch (err) {
      throw err;
    } finally {
      setSubmitLoading(false);
    }
  };

  const editUser = async (data: UserFormValues) => {
    try{
      setSubmitLoading(true);
      await updateUser(data,modalState.user?.id as string);
      toast.success("User updated successfully");
      setIsFetching((prev) => !prev);
      setModalState({ mode: null, user: null });
    }catch(err){
      throw err;
    }finally{
      setSubmitLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="User Management"
        des="Measure your advertising ROI and report website traffic."
      />
      <UsersStats userStats={userStats} />
      <UsersFilterBar
        type={filterData.type}
        onType={(value) => {
          setFilterData({ ...filterData, type: value, page: 1 });
        }}
        active={filterData.active}
        onActive={(value) => {
          setFilterData({ ...filterData, active: value, page: 1 });
        }}
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
              onSubmit={editUser}
            />
          }
        />
      )}

      {modalState.mode === "delete" && modalState.user && (
        <DeleteModal
          title="Delete User?"
          des={`Are you sure you want to delete ${modalState.user.username}? This action cannot be undone.`}
          isOpen={deletModal}
          onClose={() => {
            setDeleteModal(false);
          }}
          onConfirm={() => {
            setDeleteModal(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default UsersManagement;

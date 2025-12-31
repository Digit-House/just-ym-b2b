"use client";

import React, { useState, useMemo, useCallback } from "react";
import { MOCK_USERS } from "@/util/constants";
import Pagination from "@/components/Pagination";
import { User } from "@/types/user.type";
import UsersStats from "./_components/UsersStats";
import UsersFilterBar from "./_components/UsersFilterBar";
import UsersTable from "./_components/UsersTable";
import ModalWrapper from "@/components/ModalWrapper";
import UserForm from "./_components/UserForm";

const UsersManagement = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [query, setQuery] = useState("");

  const [modalState, setModalState] = useState<{
    mode: "add" | "edit" | "delete" | null;
    user?: User | null;
  }>({
    mode: null,
    user: null,
  });

  const total = MOCK_USERS.length;

  // Pagination
  const paginated = useMemo(
    () => MOCK_USERS.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize]
  );

  // Search Filter
  const filtered = useMemo(() => {
    return paginated.filter(
      (u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
    );
  }, [paginated, query]);

  // Modal actions
  const openAddModal = useCallback(() => {
    setModalState({ mode: "add" });
  }, []);

  const openEditModal = useCallback((user: User) => {
    setModalState({ mode: "edit", user });
  }, []);

  const openDeleteModal = useCallback((user: User) => {
    setModalState({ mode: "delete", user });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ mode: null, user: null });
  }, []);

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
        users={filtered}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
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
              onCancel={closeModal}
              onSubmit={async () => closeModal()}
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
                // delete logic here
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

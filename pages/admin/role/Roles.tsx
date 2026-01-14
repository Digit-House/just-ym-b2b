"use client";

import { useCallback, useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import SortSelect from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";
import { getResellers } from "@/graphql/reseller";
import { getErrMsg, PAGE_SIZE, SORT_OPTION } from "@/util/initData";
import ModalWrapper from "@/components/ModalWrapper";
import { Edit2, Plus, Trash2 } from "lucide-react";
import RoleCheckAction from "@/components/RoleCheckAction";
import { RoleT } from "@/types/role.type";
import RoleForm from "./_components/RoleForm";
import { getRoles, postRole, removeRole } from "@/graphql/role";
import { RoleFormValues } from "@/types/schema/roleSchema";
import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/DeleteModal";

const Roles = () => {
  const [data, setData] = useState<RoleT[]>([]);
  const [resellerOptions, setResellerOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [deletModal, setDeleteModal] = useState(false);

  const [modalState, setModalState] = useState<{
    mode: "create" | "edit" | "delete" | null;
    role?: RoleT | null;
  }>({
    mode: null,
    role: null,
  });

  const closeModal = useCallback(() => {
    setModalState({ mode: null, role: null });
  }, []);

  const [filterData, setFilterData] = useState({
    limit: PAGE_SIZE,
    page: 1,
    orderBy: {
      dir: "desc" as "asc" | "desc",
    },
    resellerId: null as string | null,
  });

  useEffect(() => {
    fetchRoles();
  }, [filterData, fetchAgain]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res: any = await getRoles(filterData);
      setData(res?.data?.findAllRoles?.data || []);
      setTotal(res?.data?.findAllRoles?.total || 0);
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResellers();
  }, []);

  const fetchResellers = async () => {
    try {
      setLoading(true);
      const res: any = await getResellers({
        limit: 100,
        page: 1,
        orderBy: { dir: "desc" },
      });
      setResellerOptions(
        res?.data?.findAllResellers?.data.map((data) => {
          return { label: data.name, value: data.id };
        }) || []
      );
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (value: RoleFormValues) => {
    try {
      setLoading(true);
      await postRole(value);
      toast.success("Successfully Created !");
      closeModal();
      setTimeout(() => {
        setFetchAgain((prev) => !prev);
      }, 2000);
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      setLoading(true);
      await removeRole(id);
      toast.success("Successfully Deleted !");
      closeModal();
      setTimeout(() => {
        setFetchAgain((prev) => !prev);
      }, 2000);
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Role" des="Manage role accounts." />
      <div className="flex items-center flex-row-reverse justify-between mb-5 gap-4 border border-[#21212124] py-[8px] px-[16px]">
        <SortSelect
          options={SORT_OPTION}
          value={filterData.orderBy.dir === "desc" ? "newest" : "oldest"}
          onChange={(value) =>
            setFilterData((prev) => ({
              ...prev,
              page: 1,
              orderBy: {
                dir: value === "newest" ? "desc" : "asc",
              },
            }))
          }
        />

        <RoleCheckAction>
          <Button
            onClick={() => {
              setModalState({ mode: "create" });
            }}
            size="lg"
            type="button"
            loading={loading}
          >
            <Plus size={18} />
            Add Role
          </Button>
        </RoleCheckAction>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-900 uppercase bg-indigo-50">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Reseller</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
                <th className="px-6 py-4 font-semibold">Updated At</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    Loading resellers...
                  </td>
                </tr>
              )}

              {!loading &&
                data.map((role) => (
                  <tr
                    key={role.id}
                    className="bg-white border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {role.name}
                    </td>

                    <td className="px-6 py-4">{role.description}</td>

                    <td className="px-6 py-4">{role.resellerId}</td>

                    <td className="px-6 py-4">
                      {new Date(role.createdAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      {new Date(role.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setModalState({
                              mode: "edit",
                              role: role,
                            });
                          }}
                          className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setModalState({
                              mode: "delete",
                              role: role,
                            });
                            setDeleteModal(true);
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalState.mode === "create" && (
        <ModalWrapper title="Create Role" onClose={closeModal}>
          <RoleForm
            mode="create"
            resellerOptions={resellerOptions}
            loading={loading}
            onCancel={closeModal}
            onSubmit={handleCreateRole}
          />
        </ModalWrapper>
      )}

      {modalState.mode === "edit" && (
        <ModalWrapper title="Edit Role" onClose={closeModal}>
          <RoleForm
            mode="edit"
            resellerOptions={resellerOptions}
            initialValues={modalState.role!}
            loading={loading}
            onCancel={closeModal}
            onSubmit={() => {}}
          />
        </ModalWrapper>
      )}

      {modalState.mode === "delete" && modalState.role && (
        <DeleteModal
          title="Delete Role?"
          des={`Are you sure you want to delete ${modalState.role.name}? This action cannot be undone.`}
          isOpen={deletModal}
          onClose={() => {
            setDeleteModal(false);
          }}
          onConfirm={() => {
            handleDeleteRole(modalState.role.id);
          }}
        />
      )}

      <Pagination
        page={filterData.page}
        pageSize={filterData.limit}
        total={total}
        onPageChange={(page) => setFilterData((prev) => ({ ...prev, page }))}
        onPageSizeChange={(limit) =>
          setFilterData((prev) => ({
            ...prev,
            limit,
            page: 1,
          }))
        }
      />
    </PageContainer>
  );
};

export default Roles;

import { useMemo, useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import SortSelect, { SortOption } from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import { useCountries } from "@/hooks/useCountries";
import { FileEdit } from "lucide-react";
import { CountryT } from "@/types/country.type";
import ModalWrapper from "@/components/ModalWrapper";
import CountryEditForm from "./_components/CountryForm";

const SORT_OPTION: SortOption[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

const Countries = () => {
  const { data: countries, isLoading } = useCountries();
  const [editCountry, setEditCountry] = useState<CountryT | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //   const sortedCountries = useMemo(() => {
  //     const list = [...countries];

  //     list.sort((a, b) => {
  //       if (sort === "newest") {
  //         return +new Date(b.createdAt) - +new Date(a.createdAt);
  //       }
  //       return +new Date(a.createdAt) - +new Date(b.createdAt);
  //     })?

  //     return list;
  //   }, [countries, sort]);

  const paginatedCountries = countries?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <PageContainer>
      <PageHeader
        title="Countries"
        des="Manage available countries and their configurations."
      />

      {/* Top bar (same as bookings) */}
      {/* <div className="flex items-center justify-end mb-5 gap-4 border border-[#21212124] py-[8px] px-[16px]">
        <SortSelect options={SORT_OPTION} value={sort} onChange={setSort} />
      </div> */}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-900 uppercase bg-indigo-50">
              <tr>
                <th className="px-6 py-4 font-semibold">Country</th>
                <th className="px-6 py-4 font-semibold">Code</th>
                <th className="px-6 py-4 font-semibold">Currency</th>
                <th className="px-6 py-4 font-semibold">Mobile Prefix</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    Loading countries...
                  </td>
                </tr>
              )}

              {!isLoading &&
                paginatedCountries.map((country) => (
                  <tr
                    key={country.id}
                    className="bg-white border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {country.name}
                    </td>
                    <td className="px-6 py-4">{country.code}</td>
                    <td className="px-6 py-4">{country.currency?.code}</td>
                    <td className="px-6 py-4">{country.mobilePrefix}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          country.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {country.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setEditCountry(country)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <FileEdit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {editCountry && (
        <ModalWrapper
          title="Edit Country"
          onClose={() => setEditCountry(null)}
          children={
            <CountryEditForm
              initialValues={editCountry}
              loading={false}
              onCancel={() => setEditCountry(null)}
              onSubmit={() => {}}
            />
          }
        />
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={paginatedCountries?.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </PageContainer>
  );
};

export default Countries;

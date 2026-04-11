import { useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import { useCountries } from "@/hooks/useCountries";
import { FileEdit } from "lucide-react";
import { CountryT } from "@/types/country.type";
import ModalWrapper from "@/components/ModalWrapper";
import CountryEditForm from "./_components/CountryForm";
import { getErrMsg, PAGE_SIZE, SORT_OPTION } from "@/util/initData";
import SortSelect from "@/components/SortSelect";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { putCountry } from "@/graphql/country";
import { SortT } from "@/types/index.type";

const Countries = () => {
  const [sort, setSort] = useState<SortT>("newest");
  const [editCountry, setEditCountry] = useState<CountryT | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [isPublished, setIsPublished] = useState<boolean | undefined>(
    undefined
  );

  const { data, isLoading, refetch } = useCountries({
    limit: pageSize,
    page,
    orderBy: {
      dir: sort === "newest" ? "desc" : "asc",
    },
    isPublished,
    search: debouncedSearch || undefined,
  });

  const countries = data?.data ?? [];
  const total = data?.total ?? 0;

  useEffect(() => {
    setPage(1);
  }, [sort, debouncedSearch, isPublished, pageSize]);

  const updateCountry = async (id: string, isPublished: boolean) => {
    try {
      setLoading(true);
      await putCountry(id, isPublished);
      setEditCountry(null);
      await refetch();
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Countries"
        des="Manage available countries and their configurations."
      />
      <div className="flex flex-wrap items-center justify-between mb-5 gap-4 border border-[#21212124] py-3 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <Input
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-55 text-sm"
          />

          <Select
            value={
              isPublished === undefined
                ? "all"
                : isPublished
                ? "published"
                : "draft"
            }
            onValueChange={(value) => {
              if (value === "all") setIsPublished(undefined);
              else setIsPublished(value === "published");
            }}
          >
            <SelectTrigger className="w-[160px] ">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <SortSelect
          options={SORT_OPTION}
          value={sort}
          onChange={(value) => setSort(value as "newest" | "oldest")}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-900 uppercase bg-indigo-50">
              <tr>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Currency</th>
                <th className="px-6 py-4">Mobile Prefix</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
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
                countries.map((country) => (
                  <tr key={country.id} className="border-b hover:bg-gray-50">
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

              {!isLoading && countries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    No countries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editCountry && (
        <ModalWrapper title="Edit Country" onClose={() => setEditCountry(null)}>
          <CountryEditForm
            initialValues={editCountry}
            loading={loading}
            onCancel={() => setEditCountry(null)}
            onSubmit={updateCountry}
          />
        </ModalWrapper>
      )}

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
    </PageContainer>
  );
};

export default Countries;

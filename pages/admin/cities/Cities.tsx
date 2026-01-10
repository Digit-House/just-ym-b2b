"use client";

import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import SortSelect from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import { useCountries } from "@/hooks/useCountries";
import { useCities } from "@/hooks/useCities";
import { FileEdit } from "lucide-react";
import { CityT } from "@/types/cities.type";
import CityEditForm from "./_components/CityForm";
import ModalWrapper from "@/components/ModalWrapper";
import { getErrMsg, SORT_OPTION } from "@/util/initData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { putCity } from "@/graphql/city";
import { toast } from "sonner";
import { SortT } from "@/types/index.type";

const Cities = () => {
  const { data: dataCountry, isLoading: countryLoading } = useCountries({
    limit: 250,
    page: 1,
    orderBy: {
      dir: "asc",
    },
    isPublished: true,
    search: undefined,
  });
  const countryData = dataCountry?.data ?? [];

  const [loading, setLoading] = useState(false);
  const [editCity, setEditCity] = useState<CityT | null>(null);

  const [countryId, setCountryId] = useState<string>("");
  const [sort, setSort] = useState<SortT>("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isPublished, setIsPublished] = useState<boolean | undefined>(
    undefined
  );

  const {
    data,
    isLoading: cityLoading,
    refetch,
  } = useCities({
    countryId: countryId,
    limit: pageSize,
    page,
    orderBy: {
      dir: sort === "newest" ? "desc" : "asc",
    },
    isPublished,
    search: null,
  });

  const cities = data?.data ?? [];
  const total = data?.total ?? 0;

  const updateCity = async (id: string, isPublished: boolean) => {
    try {
      setLoading(true);
      await putCity(id, isPublished);
      setEditCity(null);
      await refetch();
      toast.success("Successfully Updated!");
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Cities" des="Select a country to manage its cities." />

      <div className="flex flex-wrap items-center justify-between mb-5 gap-4 border border-[#21212124] py-3 px-4">
        <div className="flex items-center gap-2">
          <Select
            value={countryId || ""}
            onValueChange={(value) => {
              setCountryId(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-50">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>

            <SelectContent className="h-125">
              {countryData?.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <SelectTrigger className="w-[160px]">
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
                <th className="px-6 py-4 font-semibold">City</th>
                <th className="px-6 py-4 font-semibold">Capital</th>
                <th className="px-6 py-4 font-semibold">Timezone</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {!countryId && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Please select a country to view cities
                  </td>
                </tr>
              )}

              {(cityLoading || countryLoading) && countryId && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    Loading cities...
                  </td>
                </tr>
              )}

              {!cityLoading &&
                countryId &&
                cities.map((city: CityT) => (
                  <tr
                    key={city.id}
                    className="bg-white border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {city.name}
                    </td>

                    <td className="px-6 py-4">
                      {city.isCapital ? "Yes" : "No"}
                    </td>

                    <td className="px-6 py-4">
                      UTC {city.timezoneOffset >= 0 ? "+" : ""}
                      {city.timezoneOffset}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          city.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {city.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => setEditCity(city)}
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

      {editCity && (
        <ModalWrapper
          title="Edit City"
          onClose={() => setEditCity(null)}
          children={
            <CityEditForm
              initialValues={editCity}
              loading={loading}
              onCancel={() => setEditCity(null)}
              onSubmit={updateCity}
            />
          }
        />
      )}

      {countryId && (
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
      )}
    </PageContainer>
  );
};

export default Cities;

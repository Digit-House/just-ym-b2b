"use client";

import { useMemo, useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import SortSelect, { SortOption } from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import { useCountries } from "@/hooks/useCountries";
import { useCities } from "@/hooks/useCities";
import { FileEdit} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CityT } from "@/types/cities.type";
import CityEditForm from "./_components/CityForm";
import ModalWrapper from "@/components/ModalWrapper";

const SORT_OPTION: SortOption[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

const Cities = () => {
  const navigate = useNavigate();

  const { data: countryData, isLoading: countryLoading } = useCountries();
  const [editCity, setEditCity] = useState<CityT | null>(null);

  const [countryId, setCountryId] = useState<string>("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: cities = [], isLoading: cityLoading } = useCities(countryId);

  const sortedCities = useMemo(() => {
    const list = [...cities];

    list.sort((a: CityT, b: CityT) => {
      if (sort === "newest") {
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      }
      return +new Date(a.createdAt) - +new Date(b.createdAt);
    });

    return list;
  }, [cities, sort]);

  const paginatedCities = sortedCities.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <PageContainer>
      <PageHeader title="Cities" des="Select a country to manage its cities." />

      {/* Top bar */}
      <div className="flex items-center gap-4 mb-5 border border-[#21212124] py-[8px] px-[16px]">
        {/* Country Select */}
        <select
          value={countryId}
          onChange={(e) => {
            setCountryId(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Select Country</option>

          {countryData?.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>

        <div className="ml-auto">
          <SortSelect options={SORT_OPTION} value={sort} onChange={setSort} />
        </div>
      </div>

      {/* Table */}
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
                paginatedCities.map((city: CityT) => (
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
                        onClick={() =>
                         setEditCity(city)
                        }
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
              loading={false}
              onCancel={() => setEditCity(null)}
              onSubmit={() => {}}
            />
          }
        />
      )}

      {/* Pagination */}
      {countryId && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={sortedCities.length}
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

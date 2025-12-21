import React, { useEffect, useState } from "react";
import { TICKETS } from "../../../constants";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useCountries } from "@/hooks/useCountries";
import { getAllProducts } from "@/graphql/product";
import PageHeader from "@/components/PageHeader";
import Select from "@/components/Select";
import SortSelect, { SortOption } from "@/components/SortSelect";
import { useNavigate } from "react-router-dom";

const SORT_OPTION: SortOption[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

const Tickets = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState("newest");
  const [categories, setCategories] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  const { data: CATEGORIES } = useCategories({
    limit: 10,
    page: 1,
  });

  const { data: COUNTRIES } = useCountries();

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="w-full  mx-auto">
      <PageHeader
        title="Tickets"
        des="Measure your advertising ROI and report website traffic."
      />
      <div className="flex items-center justify-between my-10 gap-4 border border-[#21212124] py-[8px] px-[16px]">
        <div className="flex items-center">
          <Select
            label="Categories"
            placeholder="Categories"
            options={CATEGORIES}
            value={categories}
            onChange={setCategories}
            width="w-48"
          />
          <Select
            label="Countries"
            placeholder="Countries"
            options={COUNTRIES}
            value={countries}
            onChange={setCountries}
            width="w-48"
          />
        </div>
        <SortSelect options={SORT_OPTION} value={sort} onChange={setSort} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {TICKETS.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => {
              navigate(`/tickets/${ticket.id}`);
            }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src={ticket.image}
                alt={ticket.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                {ticket.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {ticket.description}
              </p>

              <button className="flex items-center text-indigo-600 text-sm font-medium mb-6 hover:text-indigo-800 transition-colors">
                Read More <ArrowRight size={16} className="ml-1" />
              </button>

              <div className="mt-auto flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{ticket.duration} for</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${ticket.price}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      per night!
                    </span>
                  </p>
                </div>
                <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tickets;

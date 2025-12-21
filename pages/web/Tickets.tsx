import React,{useEffect} from "react";
import Header from "../../components/Header";
import { TICKETS } from "../../constants";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useCountries } from "@/hooks/useCountries";
import { getAllProducts } from "@/graphql/product";

const Tickets = () => {
  const { data: categories, isLoading: cLoading } = useCategories({
    limit: 10,
    page: 1,
  });

  const { data: countries, isLoading: cnLoading } = useCountries();

  const fetchProducts = async () => {
    try{
      const res = await getAllProducts();
      console.log(res);
    }catch(err){
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProducts();
  },[])

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
        <Header
          title="Tickets"
          subtitle="Measure your advertising ROI and report website traffic."
        />
        <div className="flex items-center my-10 gap-4">
          <select className="bg-white border border-gray-200 text-gray-600 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5">
            <option value="">Select Categories</option>
            {cLoading ? (
              <option disabled>Loading...</option>
            ) : (
              categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
          <select className="bg-white border border-gray-200 text-gray-600 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5">
            <option value="">Select Country</option>
            {cnLoading ? (
              <option disabled>Loading...</option>
            ) : (
              countries.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            Sort By: <span className="font-medium text-gray-900">Newest</span>
          </div>
        </div>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {TICKETS.map((ticket) => (
          <div
            key={ticket.id}
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

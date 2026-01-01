import { ShoppingBag } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="p-8 w-full  mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
        <ShoppingBag size={48} />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-500 mb-8">
        Looks like you haven't added any tickets yet.
      </p>
      <Link
        to="/tickets"
        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
      >
        Browse Tickets
      </Link>
    </div>
  );
};

export default EmptyCart;

import React from "react";
import { Link } from "react-router-dom";
import EmptyState from "@/components/EmptyState";

const EmptyCart = () => {
  return (
    <EmptyState
      className="p-8 mx-auto min-h-[60vh]"
      title="Your cart is empty"
      description="Looks like you haven't added any tickets yet."
    >
      <Link
        to="/tickets"
        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
      >
        Browse Tickets
      </Link>
    </EmptyState>
  );
};

export default EmptyCart;

import { ChevronLeft } from "lucide-react";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";

type Props = {
  route: string;
  title: string;
  preserveParams?: boolean;
};

const BackBtn = ({ route, title, preserveParams = false }: Props) => {
  const [searchParams] = useSearchParams();

  // Construct the destination URL with preserved parameters if needed
  const destinationUrl = preserveParams ? `${route}?${searchParams.toString()}` : route;

  return (
    <Link
      to={destinationUrl}
      className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-6 text-sm font-bold group"
    >
      <ChevronLeft
        size={18}
        className="group-hover:-translate-x-1 transition-transform"
      />{" "}
      {title}
    </Link>
  );
};

export default BackBtn;

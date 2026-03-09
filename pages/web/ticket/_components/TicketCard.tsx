import ImageFallback from "@/components/ImageFallback";
import { truncateDescription } from "@/lib/utils";
import { ProductT } from "@/types/product.type";
import { UserT } from "@/types/user.type";
import { preFixImg } from "@/util/initData";
import { ArrowRight } from "lucide-react";

type Props = {
  user: UserT;
  p: ProductT;
  handleNavigate: (e: React.MouseEvent, path: string) => void;
};

const TicketCard = ({ user, p, handleNavigate }: Props) => {
  return (
    <div className="bg-white rounded-2xl  h-[420px] border overflow-hidden cursor-pointer">
      <div className="h-48 overflow-hidden">
        <ImageFallback
          src={preFixImg(p.image)}
          alt={p.name}
          className="w-full h-full transition-transform duration-500 ease-in-out hover:scale-110"
        />
      </div>

      <div className="p-6 flex flex-col">
        <div className="h-[80px]">
        <h3 className="font-bold ">{truncateDescription(p.name, 35)}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {truncateDescription(p.description)}
        </p>
        </div>

        {user.type === "OWNER" && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {`Globaltix ID: ${p.globaltixId}`}
          </p>
        )}

        <button
          onClick={(e) => handleNavigate(e, `/tickets/${p.id}`)}
          className="flex items-center text-indigo-600 text-sm font-medium mb-6 hover:text-indigo-800 transition-colors"
        >
          Read More <ArrowRight size={16} className="ml-1" />
        </button>

        <div className="mt-auto flex items-center gap-2">
          {user?.type === "OWNER" && (
            <button
              onClick={(e) => handleNavigate(e, `/admin-tickets/edit/${p.id}`)}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Edit
            </button>
          )}
          {p.isPublished && (
            <button
              onClick={(e) => handleNavigate(e, `/tickets/${p.id}`)}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;

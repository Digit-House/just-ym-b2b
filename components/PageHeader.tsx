import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

type Props = {
  title: string;
  des: string;
  isButton?: boolean;
};

const PageHeader = ({ title, des, isButton }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex flex-col gap-2 mb-5">
        <p className="text-[28px] font-bold">{title}</p>
        <p className="text-[16px] font-normal">{des}</p>
      </div>
      {isButton && (
        <Button onClick={() => navigate("/admin-vouchers/create")} size="lg">
          Add Vouchers
        </Button>
      )}
    </div>
  );
};

export default PageHeader;

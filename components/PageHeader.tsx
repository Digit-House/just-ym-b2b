import React from "react";

type Props = {
  title: string;
  des: string;
};

const PageHeader = ({ title, des }: Props) => {
  return (
    <div className="flex flex-col gap-2 mb-5">
      <p className="text-[28px] font-bold">{title}</p>
      <p className="text-[16px] font-normal">{des}</p>
    </div>
  );
};

export default PageHeader;

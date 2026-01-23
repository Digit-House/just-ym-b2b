import { LockKeyhole } from "lucide-react";

const ReadOnly = ({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) => (
  <div>
    <div className="flex items-center gap-2 mb-2 text-gray-500">
      <p className="text-xs ">{label}</p>
      <LockKeyhole size={12} className="mb-1" />
    </div>
    <div className={`h-9 flex items-center px-3 rounded-md bg-gray-100 border ${valueClassName || ''}`}>
      {value}
    </div>
  </div>
);

export default ReadOnly;

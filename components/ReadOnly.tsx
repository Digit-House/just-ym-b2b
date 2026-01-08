const ReadOnly = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="h-9 flex items-center px-3 rounded-md bg-gray-50 border">
        {value}
      </div>
    </div>
  );

export default ReadOnly;  
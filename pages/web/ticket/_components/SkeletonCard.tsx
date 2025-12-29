export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="h-48 bg-gray-200 rounded-t-2xl" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-10 bg-gray-200 rounded mt-6" />
      </div>
    </div>
  );
}

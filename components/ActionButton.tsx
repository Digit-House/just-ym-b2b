function ActionButton({ label }) {
  return (
    <button className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
      📄 {label}
    </button>
  );
}
export default ActionButton;

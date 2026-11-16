/** Stands in for a card's price while live prices load: the mascot's sunglasses, bobbing. */
const PriceLoader = () => (
  <span className="flex min-h-11 flex-col justify-center gap-1 sm:items-end">
    <svg aria-hidden viewBox="0 0 30 14" className="jy-sunglasses h-3.5 w-[30px]">
      <rect className="jy-lens" x="1" y="1" width="12" height="11" rx="5" fill="#f43c00" />
      <rect className="jy-lens" x="17" y="1" width="12" height="11" rx="5" fill="#f43c00" />
      <path d="M13 5h4" stroke="#f43c00" strokeWidth="2" />
    </svg>
    <span className="text-[11px] text-gray-500">Checking price…</span>
  </span>
);

export default PriceLoader;

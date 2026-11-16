/** Load-more indicator: a row of three ticket stubs pulsing in turn. */
const TicketStubsLoader = ({ label = "Loading more…" }: { label?: string }) => (
  <div className="flex flex-col items-center gap-2 py-6" role="status">
    <span aria-hidden className="inline-flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <b
          key={i}
          className="jy-stub relative h-3.5 w-5 rounded border-[1.5px] border-indigo-600 after:absolute after:left-1/2 after:top-1/2 after:-m-[3px] after:h-1.5 after:w-1.5 after:rounded-full after:bg-indigo-600"
        />
      ))}
    </span>
    <small className="text-xs text-gray-500">{label}</small>
  </div>
);

export default TicketStubsLoader;

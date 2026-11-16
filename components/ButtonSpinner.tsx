/** Busy indicator inside a button: one hopping dot in the text colour. */
const ButtonSpinner = ({ className = "" }: { className?: string }) => (
  <span
    aria-hidden
    className={`jy-hop-dot inline-block h-2 w-2 shrink-0 rounded-full bg-current align-middle ${className}`}
  />
);

export default ButtonSpinner;

import type { ReactNode } from "react";
import JustymLottie from "./JustymLottie";

type Props = {
  /** Height of the mascot in px; width is 5/6 of it. */
  size?: number;
  /** Optional text under the mascot, e.g. "Loading hotel details...". */
  label?: ReactNode;
  className?: string;
};

/**
 * App-wide loading indicator: the looping JustYM character with indigo
 * loading dots. For tiny spots (buttons, inputs) keep a plain spinner.
 */
const MascotLoader = ({ size = 160, label, className = "" }: Props) => (
  <div
    role="status"
    aria-label={typeof label === "string" ? label : "Loading"}
    className={`flex flex-col items-center justify-center gap-2 text-center ${className}`}
  >
    <JustymLottie src="justym-spinner" height={size} />
    {label && (
      <p className="text-sm font-medium text-gray-500">{label}</p>
    )}
  </div>
);

export default MascotLoader;

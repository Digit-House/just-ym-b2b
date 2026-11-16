import type { ReactNode } from "react";
import JustymLottie from "./JustymLottie";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  /** Buttons or links shown under the text. */
  children?: ReactNode;
  /** Height of the crying mascot in px. */
  size?: number;
  /** Smaller text for tight spots like dropdowns and dialogs. */
  compact?: boolean;
  className?: string;
};

/**
 * Shared "nothing to show" state (no results, empty lists, not found,
 * couldn't load) with the crying JustYM character.
 */
const EmptyState = ({
  title,
  description,
  children,
  size = 160,
  compact = false,
  className = "",
}: Props) => (
  <div
    className={`flex w-full flex-col items-center justify-center text-center ${
      compact ? "gap-1" : "gap-3"
    } ${className}`}
  >
    <JustymLottie src="justym-crying" height={size} />
    <h2
      className={`font-bold text-gray-900 ${compact ? "text-sm" : "text-2xl"}`}
    >
      {title}
    </h2>
    {description && (
      <p
        className={`max-w-sm text-gray-500 ${compact ? "text-xs" : "text-sm"}`}
      >
        {description}
      </p>
    )}
    {children && (
      <div className="mt-2 flex flex-col items-center gap-2">{children}</div>
    )}
  </div>
);

export default EmptyState;

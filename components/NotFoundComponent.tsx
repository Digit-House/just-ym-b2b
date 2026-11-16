import type { ReactNode } from "react";
import EmptyState from "./EmptyState";

interface NotFoundProps {
  message?: ReactNode;
  description?: ReactNode;
  /** Buttons or links shown under the text. */
  children?: ReactNode;
  /** Height of the crying mascot in px. */
  size?: number;
  className?: string;
}

/** List-level "no results" state; a thin wrapper over EmptyState. */
const NotFoundComponent = ({
  message = "No data found",
  description,
  children,
  size,
  className = "",
}: NotFoundProps) => (
  <EmptyState
    className={`py-10 ${className}`}
    title={message}
    description={description}
    size={size}
  >
    {children}
  </EmptyState>
);

export default NotFoundComponent;

import { useEffect, useState } from "react";
import JustymLottie from "@/components/JustymLottie";
import ButtonSpinner from "@/components/ButtonSpinner";

// Cached searches answer in 0.3-0.6 s: no loader before this, so they don't flash.
const STATUS_DELAY_MS = 400;
// Mood markers in justym-loading.json.
const SLOW_MOOD: [number, number] = [90, 180];

/** First load of a region search: the mascot and a "packing for {city}" bubble. */
export const SearchPageLoader = ({ city }: { city: string }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShow(true), STATUS_DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  return (
    <div
      className="flex min-h-80 flex-col items-center justify-center gap-3 py-16"
      role="status"
      aria-live="polite"
    >
      {show ? (
        <>
          <JustymLottie src="justym-loading" height={145} />
          <p className="jy-bubble max-w-[240px] rounded-[18px] border-2 border-indigo-600 bg-indigo-50 px-3 py-2 text-center text-xs font-bold text-indigo-900">
            {city
              ? `Hang tight, I'm packing for ${city}!`
              : "Hang tight, I'm finding hotels!"}
          </p>
        </>
      ) : (
        <span className="sr-only">Loading hotels...</span>
      )}
    </div>
  );
};

/** The search request failed: the mascot, slowed down, and a retry. */
export const SearchError = ({
  retrying,
  onRetry,
}: {
  retrying: boolean;
  onRetry: () => void;
}) => (
  <div
    className="flex flex-col items-center justify-center gap-3 py-16 text-center"
    role="alert"
  >
    <JustymLottie
      src="justym-loading"
      height={115}
      speed={0.35}
      segment={SLOW_MOOD}
      stillFrame={SLOW_MOOD[0]}
    />
    <p className="text-base font-semibold text-gray-700">
      Oops, the hotel search tripped
    </p>
    <p className="max-w-xs text-sm text-gray-400">
      Something went wrong on the way. Shall we try again?
    </p>
    <button
      type="button"
      onClick={onRetry}
      disabled={retrying}
      className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
    >
      {retrying && <ButtonSpinner className="mr-2" />}
      Retry
    </button>
  </div>
);

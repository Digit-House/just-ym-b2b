import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { LottieRefCurrentProps } from "lottie-react";

// lottie-web is heavy, so it is only loaded the first time a mascot renders.
const Lottie = lazy(() => import("lottie-react"));

type LottieJson = Record<string, unknown>;

const cache = new Map<string, Promise<LottieJson>>();
// Fetched from /public once per file so the animations stay out of the JS bundle.
const loadLottie = (src: string) => {
  let request = cache.get(src);
  if (!request) {
    const fresh: Promise<LottieJson> = fetch(`/lottie/${src}.json`).then(
      (r) => {
        if (!r.ok) throw new Error(`lottie ${src} ${r.status}`);
        return r.json() as Promise<LottieJson>;
      }
    );
    request = fresh;
    cache.set(src, fresh);
    // A failed fetch must not be served again.
    fresh.catch(() => {
      if (cache.get(src) === fresh) cache.delete(src);
    });
  }
  return request;
};

type Props = {
  /** Lottie file name in /public/lottie, without ".json". */
  src: "justym-spinner" | "justym-crying" | "justym-loading";
  /** Height in px; width follows the files' 500x600 (5:6) aspect ratio. */
  height: number;
  /** Frame held when the viewer prefers reduced motion. */
  stillFrame?: number;
  /** Playback speed: >1 busy, <1 waiting or sad. */
  speed?: number;
  /** Frames to loop, e.g. a mood marker's range in the file. */
  segment?: [number, number];
  className?: string;
};

/**
 * A looping JustYM character animation (same files as the consumer site and
 * mobile app). The box is sized before the JSON arrives so nothing shifts
 * when it starts. Decorative: callers label the state around it.
 */
const JustymLottie = ({
  src,
  height,
  stillFrame = 0,
  speed = 1,
  segment,
  className = "",
}: Props) => {
  const reduced = useReducedMotion();
  const ref = useRef<LottieRefCurrentProps | null>(null);
  const [data, setData] = useState<LottieJson | null>(null);

  useEffect(() => {
    let alive = true;
    loadLottie(src)
      .then((json) => {
        // lottie mutates the data it plays, so each instance gets its own copy.
        if (alive) setData(structuredClone(json));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [src]);

  useEffect(() => {
    const a = ref.current;
    if (!a?.animationItem) return;
    if (reduced) a.goToAndStop(stillFrame, true);
    else a.play();
  }, [reduced, stillFrame]);

  useEffect(() => {
    ref.current?.setSpeed(speed);
  }, [speed, data]);

  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 ${className}`}
      style={{ width: Math.round((height * 5) / 6), height }}
    >
      {data && (
        <Suspense fallback={null}>
          <Lottie
            key={src}
            lottieRef={ref}
            animationData={data}
            loop
            autoplay={!reduced}
            initialSegment={segment}
            onDOMLoaded={() => {
              ref.current?.setSpeed(speed);
              if (reduced) ref.current?.goToAndStop(stillFrame, true);
            }}
            rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            style={{ width: "100%", height: "100%" }}
          />
        </Suspense>
      )}
    </span>
  );
};

export default JustymLottie;

import { useEffect, useRef } from "react";

export function useInfiniteScroll(
  hasNextPage?: boolean,
  isFetching?: boolean,
  onLoadMore?: () => void
) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetching) {
        onLoadMore?.();
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching, onLoadMore]);

  return ref;
}

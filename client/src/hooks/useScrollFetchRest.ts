import { useEffect, useRef, useState } from "react";
import { PostDto, SavePostDto } from "../types";
import { fetchTimeline__api } from "../api/postApi";

export const useScrollFetchRest = ({
  userId,
  scrollEl,
  onWindow = true,
}: {
  userId: number;
  scrollEl?: React.MutableRefObject<HTMLElement | null>;
  onWindow?: boolean;
}) => {
  const [data, setData] = useState<PostDto[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);

  const refAnchor = useRef<HTMLElement | null>(null);

  const fetchData = async () => {
    if (loading || noMoreData) return;
    setLoading(true);

    try {
      const newData = await fetchTimeline__api({ page, user: userId });
      if (!newData || newData.length === 0) {
        setNoMoreData(true);
      } else {
        setData((prev) => [...prev, ...newData]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }

    setLoading(false);
  };

  const loadMore = () => {
    const refRect = refAnchor.current?.getBoundingClientRect();
    const scrollRect = scrollEl?.current?.getBoundingClientRect() || {
      top: 0,
      bottom: window.innerHeight,
    };

    if (
      !loading &&
      !noMoreData &&
      refRect &&
      refRect?.top < scrollRect.bottom + 200
    ) {
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const el = onWindow ? window : scrollEl?.current;
    if (!el) return;

    const scrollListener = () => loadMore();

    el.addEventListener("scroll", scrollListener);
    return () => el.removeEventListener("scroll", scrollListener);
  }, [scrollEl?.current, loading, noMoreData]);

  return {
    data,
    refAnchor,
    noMoreData,
    loading,
  };
};

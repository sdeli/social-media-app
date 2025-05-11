import { useEffect, useRef, useState } from "react";
import { PostDto } from "../types";
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
  const pageRef = useRef(0);
  const [loading, setLoading] = useState(false);
  const [dataInited, setDataInited] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const refAnchor = useRef<HTMLElement | null>(null);

  const fetchData = async () => {
    console.log('loading ============')
    console.log(loading);
    if (loading || noMoreData) return;
    setLoading(true);

    try {
      const newData = await fetchTimeline__api({ page: pageRef.current, user: userId });

      if (!newData || newData.length === 0) {
        setNoMoreData(true);
      } else {
        setData((prev) => [...prev, ...newData]);
        pageRef.current += 1;
      }
      // debugger
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
    console.log('done');
    setLoading(false);
  };

  const loadMore = () => {
    const refRect = refAnchor.current?.getBoundingClientRect();
    const scrollRect = scrollEl?.current?.getBoundingClientRect() || {
      top: 0,
      bottom: window.innerHeight,
    };

    console.log('top ========')
    console.log(refRect.top);
    console.log(scrollRect.bottom);
    console.log(!loading &&
      !noMoreData &&
      refRect &&
      refRect.top >= scrollRect.bottom - 200);
    if (
      !loading &&
      !noMoreData &&
      refRect &&
      refRect.top >= scrollRect.bottom - 200
    ) {
      console.log('go');
      fetchData();
    }
  };

  // 🆕 Keep fetching until the anchor is near bottom or noMoreData
  const fetchUntilFilled = async () => {
    while (true) {
      const refRect = refAnchor.current?.getBoundingClientRect();
      const scrollRect = scrollEl?.current?.getBoundingClientRect() || {
        top: 0,
        bottom: window.innerHeight,
      };
      // debugger
      if (noMoreData || !refRect || refRect.top >= scrollRect.bottom - 200) {
        console.log('break');
        // debugger
        break;
      } else {
        // debugger
        await fetchData();
      }
    }
  };

  useEffect(() => {
    if (!dataInited) {
      fetchUntilFilled();
      setDataInited(true);
    }
  }, [refAnchor.current]);

  useEffect(() => {
    const el = onWindow ? window : scrollEl?.current;
    if (!el) return;

    let debounceTimeout: any;

    const debouncedScrollListener = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        loadMore();
      }, 200);
    };

    el.addEventListener("scroll", debouncedScrollListener);
    return () => {
      clearTimeout(debounceTimeout);
      el.removeEventListener("scroll", debouncedScrollListener);
    };
  }, [scrollEl?.current, loading, noMoreData]);

  return {
    data,
    refAnchor,
    noMoreData,
    loading,
  };
};

import { useEffect, useRef, useState } from "react";
import { PostDto, UserDto } from "../types";
import { fetchPostsAction, setPageAction } from '../store/postActions';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { fetchPossibleFriendsAction } from '../store/friendshipsActions';
import { selectPage } from '../store/postSlice';

export enum FetchType {
  POSTS = 'POSTS',
  FRIENDS = 'FRIENDS',
}

export const useScrollFetchRest = ({
  userId,
  scrollEl,
  onWindow = true,
  fetchType = FetchType.POSTS,
  query,
}: {
  userId: string;
  scrollEl?: React.MutableRefObject<HTMLElement | null>;
  onWindow?: boolean;
  fetchType?: FetchType;
  query?: string,
}) => {
  const dispatch = useAppDispatch();
  let page: number;

  page = useSelector(selectPage);
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [friendsips, setFriendships] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const dataInited = useRef<boolean>(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const refAnchor = useRef<HTMLElement | null>(null);

  async function fetchData() {
    if (loading) return;
    setLoading(true);
    try {
      if (fetchType === FetchType.POSTS) {
        const newPosts = await dispatch(fetchPostsAction({ user: userId }))

        if (newPosts && newPosts.length) {
          setPosts((prev) => [...prev, ...newPosts]);
        } else {
          setNoMoreData(true);
        }
      }

      if (fetchType === FetchType.FRIENDS) {
        const dto = { query: query || '', user: userId }
        const newFriends = await dispatch(fetchPossibleFriendsAction(dto))
        if (newFriends && newFriends.length) {
          setFriendships((prev) => [...prev, ...newFriends]);
        } else {
          setNoMoreData(true);
        }
      }
    } catch (err) {
    }

    setLoading(false);
  };

  async function loadMore() {
    const refRect = refAnchor.current?.getBoundingClientRect();
    const scrollRect = scrollEl?.current?.getBoundingClientRect() || {
      top: 0,
      bottom: window.innerHeight,
    };
    // console.log('=-=======');
    // console.log(loading);
    // console.log(noMoreData);
    // console.log(refRect);
    // console.log(refRect.top);
    // console.log(scrollRect.bottom - 200);
    if (
      !loading &&
      !noMoreData &&
      refRect &&
      refRect.top >= scrollRect.bottom - 200
    ) {
      await fetchData();
    } else {
      if (!refAnchor.current) return;
      const isAtBottom = elementIsVisibleInViewport(refAnchor.current)
      if (isAtBottom) {
        await fetchData();
      }
    }
  };

  const fetchUntilFilled = async () => {
    var i = 0
    while (true) {
      const refRect = refAnchor.current?.getBoundingClientRect();
      const scrollRect = scrollEl?.current?.getBoundingClientRect() || {
        top: 0,
        bottom: window.innerHeight,
      };

      const minus = fetchType === FetchType.POSTS ? 200 : 40;
      if (noMoreData || !refRect || refRect.top >= scrollRect.bottom - minus) {
        i++;
        break;
      } else {
        await fetchData();
        i++;
      }
    }
  };

  function elementIsVisibleInViewport(el: HTMLElement, partiallyVisible = false) {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
      ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
      ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
  };

  useEffect(() => {
    if (!dataInited.current) {
      fetchUntilFilled();
      dataInited.current = true;
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
      }, 100);
    };

    el.addEventListener("wheel", debouncedScrollListener);

    return () => {
      clearTimeout(debounceTimeout);
      el.removeEventListener("wheel", debouncedScrollListener);
    };
  }, [scrollEl?.current, loading, noMoreData]);

  return {
    data: FetchType.POSTS ? posts : friendsips,
    refAnchor,
    noMoreData,
    loading,
  };
};

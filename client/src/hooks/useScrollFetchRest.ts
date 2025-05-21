import { useEffect, useRef, useState } from "react";
import { FriendshipDto, PostDto, UserDto } from "../types";
import { fetchTimeline__api } from "../api/postApi";
import { fetchPostsAction, setPageAction } from '../store/postActions';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { fetchPossibleFriendsAction, setPossibleFriendsPageAction } from '../store/friendshipsActions';
import { selectPossibleFriends, selectPossibleFriendsPage } from '../store/friendshipSlice';
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

  if (fetchType === FetchType.POSTS) {
    page = useSelector(selectPage);
  } else {
    page = useSelector(selectPossibleFriendsPage);
  }
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [friendsips, setFriendships] = useState<UserDto[]>([]);
  const pageRef = useRef(page);
  const [loading, setLoading] = useState(false);
  const [dataInited, setDataInited] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const refAnchor = useRef<HTMLElement | null>(null);
  const fetchData = async () => {
    if (loading || noMoreData) return;
    setLoading(true);

    try {
      if (fetchType === FetchType.POSTS) {
        const newPosts = await dispatch(fetchPostsAction({ page: pageRef.current, user: userId }))
        if (newPosts && newPosts.length) {
          setPosts((prev) => [...prev, ...newPosts]);
          pageRef.current += 1;
          dispatch(setPageAction(pageRef.current))
        } else {
          setNoMoreData(true);
        }
      }

      if (fetchType === FetchType.FRIENDS) {
        const newFriends = await dispatch(fetchPossibleFriendsAction({ page: pageRef.current, query: query || '', user: userId }))
        if (newFriends && newFriends.length) {
          setFriendships((prev) => [...prev, ...newFriends]);
          pageRef.current += 1;
          dispatch(setPossibleFriendsPageAction(pageRef.current))
        } else {
          setNoMoreData(true);
        }
      }
    } catch (err) {
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
      refRect.top >= scrollRect.bottom - 200
    ) {
      fetchData();
    }
  };

  const fetchUntilFilled = async () => {
    while (true) {
      const refRect = refAnchor.current?.getBoundingClientRect();
      const scrollRect = scrollEl?.current?.getBoundingClientRect() || {
        top: 0,
        bottom: window.innerHeight,
      };

      const minus = fetchType === FetchType.POSTS ? 200 : 40;
      if (noMoreData || !refRect || refRect.top >= scrollRect.bottom - minus) {
        break;
      } else {
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
    data: FetchType.POSTS ? posts : friendsips,
    refAnchor,
    noMoreData,
    loading,
    page: pageRef
  };
};

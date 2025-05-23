import { Avatar, Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useScrollFetch } from "../../hooks/useScrollFetch";
import { RootState } from "../../store/store";
import { Post } from "./Post";
import { useScrollFetchRest } from '../../hooks/useScrollFetchRest';
import { PostDto } from '../../types';
import { selectPosts } from '../../store/postSlice';

interface Props {
  id?: string;
  name?: string;
  picture?: string;
}

export const UserPosts = () => {
  const { id, username, picture } = useSelector((state: RootState) => state.user);
  const posts = useSelector(selectPosts);
  const userId = id;
  const scrollEl = useRef(null);

  const { refAnchor, noMoreData } = useScrollFetchRest({ userId, scrollEl });

  return (
    <Box maxWidth="sm"
      style={{
        minHeight: '100vh',
      }}
      ref={scrollEl}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          p: 2,
          m: 1,
          mb: 4,
        }}
      >
        <Avatar src={picture} sx={{ width: "60px", height: "60px" }} />
        <Typography ml={2} fontSize={18}>
          {username}
        </Typography>
      </Box>

      {posts.length &&
        posts.map((post: PostDto, i) => (
          <Post post={post} key={i} />
        ))}
      {noMoreData ? (
        <Typography textAlign="center">
          No {posts.length > 0 && "more"}{" "}
          posts
        </Typography>
      ) : (
        <Typography textAlign="center" ref={refAnchor}>
          Loading ...
        </Typography>
      )}
    </Box>
  );
};

import { Container, Typography } from "@mui/material";
import { useScrollFetchRest } from "../../hooks/useScrollFetchRest";
import { Post } from "./Post";
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import { fetchPostsAction } from '../../store/postActions';
import { selectPosts } from '../../store/postSlice';

export const Timeline = () => {
  const user = useSelector(selectUser);
  const posts = useSelector(selectPosts);
  const { refAnchor, noMoreData } = useScrollFetchRest({ userId: user.id });

  return (
    <Container maxWidth="sm">
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      {noMoreData ? (
        <Typography textAlign="center" mt={2}>
          No {posts.length > 0 && "more "}posts
        </Typography>
      ) : (
        <Typography textAlign="center" ref={refAnchor}>
          Loading ...
        </Typography>
      )}
    </Container>
  );
};
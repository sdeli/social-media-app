import { Container, Typography } from "@mui/material";
import { useScrollFetchRest } from "../../hooks/useScrollFetchRest";
import { Post } from "./Post";
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';

export const Timeline = () => {
  const user = useSelector(selectUser);
  const { data, refAnchor, noMoreData } = useScrollFetchRest({ userId: user.id });

  if (!data) return null;

  return (
    <Container maxWidth="sm">
      {data.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      {noMoreData ? (
        <Typography textAlign="center" mt={2}>
          No {data.length > 0 && "more "}posts
        </Typography>
      ) : (
        <Typography textAlign="center" ref={refAnchor}>
          Loading ...
        </Typography>
      )}
    </Container>
  );
};
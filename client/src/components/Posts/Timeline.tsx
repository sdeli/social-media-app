import { Container, Typography } from "@mui/material";
import { useScrollFetchRest } from "../../hooks/useScrollFetchRest";
import { Post } from "./Post";

export const Timeline = ({ userId }: { userId: number }) => {
  const { data, refAnchor, noMoreData } = useScrollFetchRest({ userId });

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
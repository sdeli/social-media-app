import { gql, useMutation } from "@apollo/client";
import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Modal,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  createContext,
  useRef,
} from "react";
import { useScrollFetch } from "../../hooks/useScrollFetch";
import { getTime } from "../../utils/utils";
import { Comment } from "../Comment/Comment";
import { CreateComment } from "../Comment/CreateComment";
import { LikeDislike } from "../LikeDislike";
import { LoadMore } from "../LoadMore";
import { Media } from "../Media";
import { UserAvatar } from "../UserAvatar";
import { CommentDto, PostDto } from '../../types';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';

export interface UserData {
  id: string;
  name: string;
  picture: string;
  email: string
}

enum PostDisplayType {
  NORMAL = "NORMAL",
  FULL = "FULL",
}

const GET_COMMENTS = gql`
    query ($postId: Int!, $page: Int) {
        getComments(postId: $postId, page: $page) {
            id
            content
            media
            mediaType
            User {
                id
                name
                picture
            }
            createdAt
        }
    }
`;

export const Post = ({ post }: { post: PostDto }) => {
  const [open, setOpen] = useState(false);
  const scrollEl = useRef<HTMLElement | null>(null);

  const {
    data: comments,
    noMoreData,
    refAnchor,
    fetch,
  } = useScrollFetch({
    QUERY: GET_COMMENTS,
    variables: { postId: post.id },
    scrollEl,
    onWindow: false,
    reverseScroll: true,
  });

  const viewMoreComments = () => {
    setOpen(true);
  };

  return (
    <>
      <Modal open={open} onClose={(_) => setOpen(false)}>
        <Container
          maxWidth="sm"
          sx={{
            height: "100vh",
            outline: "none",
            pr: "0 !important",
            display: "flex",
            alignItems: "center",
            "& > *": { height: "95%", flexGrow: 1 },
          }}
        >
          <PostDisplay
            mode={PostDisplayType.FULL}
            post={post}
            viewMoreComments={viewMoreComments}
            noMoreData={noMoreData}
            refAnchor={refAnchor}
            scrollEl={scrollEl}
          />
        </Container>
      </Modal>

      <PostDisplay
        mode={PostDisplayType.NORMAL}
        post={post}
        viewMoreComments={viewMoreComments}
      />
    </>
  );
};

const PostDisplay = ({
  post,
  mode = PostDisplayType.NORMAL,
  viewMoreComments,
  refAnchor,
  scrollEl,
  noMoreData,
}: {
  post: PostDto;
  mode: PostDisplayType;
  viewMoreComments: Function;
  noMoreData?: boolean;
  refAnchor?: React.MutableRefObject<HTMLElement | null>;
  scrollEl?: React.MutableRefObject<HTMLElement | null>;
}) => {
  const IS_FULL_MODE = mode === PostDisplayType.FULL;
  const currentUser = useSelector(selectUser);
  const [showCreateComment, setShowCreateComment] = useState(mode === PostDisplayType.FULL);
  const [commentsAdded, setCommentsAdded] = useState<CommentDto[]>([]);
  const [lastComment, setLastComment] = useState<CommentDto | null>(post.comments[0] || null);
  const [comments] = useState<CommentDto[] | null>(getComments(post));

  const commentCreated = (comment: CommentDto) => {
    setLastComment(comment);
    if (IS_FULL_MODE) {
      setCommentsAdded([comment, ...commentsAdded]);
    }
  };

  function getComments(post: PostDto) {
    if (post.comments.length > 0) {
      if (IS_FULL_MODE) {
        return post.comments;
      } else {
        return post.comments.slice(1, post.comments.length)
      }
    } else {
      return null;
    }
  }

  function getCommentElems(comments: CommentDto[]) {
    return comments.map((comment, i) => {
      const prevId = comments[i - 1] ? comments[i - 1].commentedBy.id : null;

      return (
        <Comment
          key={comment.id}
          prevId={prevId}
          comment={comment}
        />
      )
    });
  }

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        p: 0,
        flexDirection: "column",
        margin: 1,
        maxHeight: "100%",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          p: 0,
          flexDirection: "column",
          margin: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
        ref={scrollEl}
      >
        <Box
          sx={{
            p: "5px",
            display: "flex",
            alignItems: "center",
            "& > *": { margin: 1 },
          }}
        >
          <UserAvatar
            picture={post.postedBy.picture || ''}
            id={post.postedBy.id}
          />
          <Box>
            <Typography fontWeight="500">
              {post.postedBy.username}
            </Typography>
            <Typography fontWeight="200" fontSize={11}>
              {getTime(post?.createdAt)}
            </Typography>
          </Box>
        </Box>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            m: 0,
            p: 0,
            "& >*": {
              width: "100%",
            },
          }}
        >
          {post?.content && <LoadMore text={post?.content} />}

          {post?.media && (
            <Box
              my={2}
              mx={0}
              display="flex"
              justifyContent="center"
            >
              <Media
                playable
                mediaPath={'http://localhost:3000' + post.media}
                mediaType={post.mediaType}
              />
            </Box>
          )}

          <Divider sx={{ mt: 2 }} />

          <Box
            display="flex"
            width="100%"
            justifyContent="space-around"
            sx={{ "& > * ": { width: "33%" } }}
          >
            <LikeDislike post={post} currentUserId={currentUser.id} />
            <Button
              sx={{
                color: "#777",
                textTransform: "capitalize",
              }}
              onClick={() => setShowCreateComment(true)}
            >
              Comment
            </Button>
          </Box>

          <Divider />

          {lastComment && !IS_FULL_MODE && (
            <>
              <Box
                sx={{
                  mt: 2,
                  ml: 3,
                }}
              >
                <Typography
                  onClick={() => viewMoreComments()}
                  sx={{
                    ":hover": {
                      textDecoration: "underline",
                    },
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  View more comments
                </Typography>
              </Box>
              <Comment comment={lastComment} />
            </>
          )}

          {commentsAdded && commentsAdded.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}

          {IS_FULL_MODE && comments && getCommentElems(comments)}

          {noMoreData === false && (
            <Typography
              textAlign="center"
              fontSize={12}
              ref={refAnchor}
            >
              Loading ...
            </Typography>
          )}
        </CardContent>

      </Box>
      {(showCreateComment || IS_FULL_MODE) && (
        <Container>
          <CreateComment
            postId={post.id}
            commentCreated={commentCreated}
          />
        </Container>
      )}
    </Card>
  );
};
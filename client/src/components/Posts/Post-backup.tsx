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
import { getTime } from "../../utils/getTime";
import { Comment } from "../Comment/Comment";
import { CommentType, CreateComment } from "../Comment/CreateComment";
import { LikeDislike } from "../LikeDislike";
import { LoadMore } from "../LoadMore";
import { Media } from "../Media";
import { UserAvatar } from "../UserAvatar";
import { likePost__api } from '../../api/postApi';
import { CommentDto, LikePostsDto, PostDto } from '../../types';
import { useScrollFetchComments } from '../../hooks/useScrollFetchComments';
import { fetchComments__api } from '../../api/commentApi';

export interface UserData {
  id: number;
  name: string;
  picture: string;
}

export interface Post {
  id: number;
  User: UserData;
  content?: string;
  media?: string;
  mediaType?: string;
  likes: number;
  dislikes: number;
  lastComment: CommentType;
  createdAt: string;
  hasLiked: boolean;
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

export const likeContext = createContext<{
  likeCount: number;
  dislikeCount: number;
  hasLiked: boolean | null;
  likeHandler: (isLike: boolean) => void;
}>({
  likeCount: 0,
  dislikeCount: 0,
  hasLiked: false,
  likeHandler: (isLike: boolean) => { },
});

export const Post = ({ post }: { post: PostDto }) => {
  const [open, setOpen] = useState(false);
  const scrollEl = useRef<HTMLElement | null>(null);

  const [likeCount, setLikeCount] = useState(post.likes);
  const [dislikeCount, setDislikeCount] = useState(post.dislikes || 0);
  const commentsScrollRef = useRef<HTMLDivElement | null>(null);
  const
  const [hasLiked, setHasLiked] = useState<boolean | null>(post.hasLiked || null);

  const {
    data: comments,
    noMoreData,
    refAnchor,
    fetchData: fetch,
  } = useScrollFetchComments({ userId: 1, scrollEl: commentsScrollRef, postId: post.id });

  const likeHandler = (isLike: boolean) => {
    // likePost({ variables: { postId: post.id, isLike } });
    const dto: LikePostsDto = { isLike, postId: post.id, user: 1 };
    likePost__api(dto).then((post) => {
      if (post) {
        setHasLiked(post.hasLiked || null)
        setLikeCount(post.likes)
        setDislikeCount(post.dislikes || 0)
      }
    })
  };

  const viewMoreComments = () => {
    setOpen(true);
    fetchComments__api({ page: 0, user: 1, postId: post.id }).then((comments) => {
      if (!comments) return;

      setComm
      setOpen(true);
    })
  };

  return (
    <likeContext.Provider value={{ likeCount, dislikeCount, hasLiked, likeHandler }}>
      <Modal open={open} onClose={(_) => setOpen(false)}>
        <Container
          ref={commentsScrollRef}
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
            mode={"full"}
            post={post}
            viewMoreComments={viewMoreComments}
            scrollEl={scrollEl}
            noMoreData={noMoreData}
            refAnchor={refAnchor}
          />
        </Container>
      </Modal>

      <PostDisplay
        mode={"normal"}
        post={post}
        viewMoreComments={viewMoreComments}
        noMoreData={noMoreData}
        refAnchor={refAnchor}
      />
    </likeContext.Provider>
  );
};

const PostDisplay = ({
  post,
  mode = "normal",
  viewMoreComments,
  scrollEl,
  noMoreData,
  refAnchor
}: {
  post: PostDto;
  lastComment?: CommentType;
  mode: "normal" | "full";
  viewMoreComments: Function;
  scrollEl?: React.MutableRefObject<HTMLElement | null>;
  noMoreData: boolean,
  refAnchor: React.MutableRefObject<HTMLElement | null>
}) => {
  const [showCreateComment, setShowCreateComment] = useState(mode === "full");
  const [comments, setComments] = useState<CommentDto[]>(post.comments);
  const [commentsAdded, setCommentsAdded] = useState<CommentDto[]>([]);

  const [lastComment, setLastComment] = useState<CommentDto>(post.lastComment);
  const commentCreated = (comment: CommentDto) => {
    setLastComment(comment);
    if (mode === "full") {
      setCommentsAdded([comment, ...commentsAdded]);
      setComments([comment, ...comments]);
    }
  };

  useEffect(() => {
    setCommentsAdded([]);
  }, [post.comments]);

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
            picture={post?.User?.picture || ''}
            id={post.User.id}
          />
          <Box>
            <Typography fontWeight="500">
              {post?.User?.name}
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
                mediaPath={post.media}
                mediaType={post.mediaType || null}
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
            <LikeDislike postId={post?.id} />
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
          {lastComment && mode === "normal" && (
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
          {commentsAdded?.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
          {comments &&
            comments?.map((comment, i) => (
              <Comment
                key={comment.id}
                prevId={comments?.[i - 1]?.User?.id}
                comment={comment}
              />
            ))}
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
      {(showCreateComment || mode === "full") && (
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

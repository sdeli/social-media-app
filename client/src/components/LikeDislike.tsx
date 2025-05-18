import { gql, useMutation } from "@apollo/client";
import { css } from "@emotion/css";
import {
  ThumbDownAlt,
  ThumbDownAltOutlined,
  ThumbUpAlt,
  ThumbUpAltOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { LikePostsDto, PostDto } from '../types';
import { likePost__api } from '../api/postApi';
import { useState } from 'react';

interface LikeDislikeProps {
  post: PostDto;
  currentUserId: string
}

export const LikeDislike = ({ post, currentUserId }: LikeDislikeProps) => {
  const [hasLiked] = useState<boolean | null>(getHasLiked);

  function getHasLiked() {
    const likeDislike = post.likesDislike.find(likeDislike => likeDislike.user.id === currentUserId)
    if (likeDislike) {
      if (likeDislike.isLike !== undefined) {
        return likeDislike.isLike;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  function likeHandler(isLike: boolean) {
    const dto: LikePostsDto = { isLike, postId: post.id, user: currentUserId };
    likePost__api(dto);
  };

  return (
    <>
      <Button
        className='sannya1111'
        sx={{
          color: "#555",
          "& > * ": { margin: "5px" },
          fontFamily: "Roboto !important",
        }}
        onClick={() => likeHandler(true)}
      >
        {hasLiked === true ? (
          <ThumbUpAlt color="primary" />
        ) : (
          <ThumbUpAltOutlined />
        )}
        <span
          className={css({
            color: "#555",
            "& > * ": { margin: "3px" },
            fontFamily: "Roboto !important",
          })}
        >
          {post.likes}
        </span>
      </Button>
      <Button
        sx={{
          color: "#555",
          "& > * ": { margin: "5px" },
          fontFamily: "Roboto !important",
        }}
        onClick={() => likeHandler(false)}
      >
        {hasLiked === false ? (
          <ThumbDownAlt color="primary" />
        ) : (
          <ThumbDownAltOutlined />
        )}
        <span
          className={css({
            color: "#555",
            "& > * ": { margin: "3px" },
            fontFamily: "Roboto !important",
          })}
        >
          {post.dislikes}
        </span>
      </Button>
    </>
  );
};

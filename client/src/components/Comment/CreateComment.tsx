import { gql, useMutation } from "@apollo/client";
import { css } from "@emotion/css";
import { TextareaAutosize } from "@mui/material";
import { Box } from "@mui/system";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Media } from "../Media";
import { UserData } from "../Posts/Post";
import { UploadMedia } from "../UploadMedia";
import { postComment__api } from '../../api/commentApi';
import { CommentDto, PostCommentDto } from '../../types';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';

interface Props {
  postId: number;
  commentCreated: (comment: CommentDto) => void;
}

export const CreateComment = ({ postId, commentCreated }: Props) => {
  const user = useSelector(selectUser);
  const [content, setContent] = useState("");

  const [media, setMedia] = useState<{ type: string; media: Blob } | null>();
  const [mediaPath, setMediaPath] = useState<null | string>(null);

  const createHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const dto: PostCommentDto = {
        postId,
        content,
        user: user.id
      }

      if (media) {
        dto.media = media?.media;
      }

      postComment__api(dto)
        .then(comment => {
          commentCreated(comment as CommentDto)
        })
      setContent("");
      setMedia(null);
      setMediaPath("");
      e.preventDefault();
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        sx={{
          background: "#ddd",
          mx: 1,
          borderRadius: "10px",
        }}
      >
        <TextareaAutosize
          onKeyDown={createHandler}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={css({
            fontFamily: "Roboto",
            width: "90%",
            margin: "10px",
            resize: "none",
            border: "none",
            ":focus": { outline: "none" },
            background: "transparent",
          })}
          placeholder={`Write your comment`}
        ></TextareaAutosize>
        <UploadMedia
          // @ts-ignore
          setMedia={setMedia}
          size="small"
          setMediaPath={setMediaPath}
        />
      </Box>
      {
        media &&
        <Box width={100} ml={3} mt={2}>
          <Media mediaPath={mediaPath} mediaType={media.type} />
        </Box>
      }
    </Box>
  );
};

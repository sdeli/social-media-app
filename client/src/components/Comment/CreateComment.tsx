import { gql, useMutation } from "@apollo/client";
import { css } from "@emotion/css";
import { TextareaAutosize } from "@mui/material";
import { Box } from "@mui/system";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Media } from "../Media";
import { UserData } from "../Posts/Post";
import { UploadMedia } from "../UploadMedia";
import { postComment__api } from '../../api/commentApi';
import { CommentDto, MediaFileType, PostCommentDto } from '../../types';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import { useAppDispatch } from '../../store/hooks';
import { addCommentAction } from '../../store/postActions';

interface Props {
  postId: number;
}

export const CreateComment = ({ postId }: Props) => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const [content, setContent] = useState("");

  const [media, setMedia] = useState<MediaFileType>();
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

      dispatch(addCommentAction(dto))
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

import {
  Button,
  Card,
  CardContent,
  Divider,
  Modal,
  TextareaAutosize,
} from "@mui/material";
import { css } from "@emotion/css";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import { ErrorDisplay } from "../ErrorDisplayer";
import { UploadMedia } from "../UploadMedia";
import { Media } from "../Media";
import { SavePostsDto } from '../../types';
import { createPost__api } from '../../api/postApi';

export const CreatPost = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [media, setMedia] = useState<{ type: string; media: File } | null>();
  const [mediaPath, setMediaPath] = useState<null | string>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { name } = useSelector((state: RootState) => state.user);

  const post = async () => {
    const dto: SavePostsDto = {
      user: 1
    }

    if (media) dto.media = media.media;
    if (content) dto.content = content;
    setIsLoading(true);
    await createPost__api(dto);
    setIsLoading(false);
    resetForm();
    setModalOpen(false);
  };

  const resetForm = () => {
    setMedia(null);
    setMediaPath(null);
    setContent("");
    setModalOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ marginLeft: "auto", display: "block" }}
        onClick={() => setModalOpen(true)}
      >
        Create Post 11111
      </Button>
      <Modal
        open={modalOpen}
        onClose={() => {
          resetForm();
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            width: "500px",
            height: "400px",
            textAlign: "center",
            paddingBottom: "100px",
            position: "relative",
          }}
        >
          <h2>Create Pos 222</h2>
          <CardContent
            sx={{
              overflow: "auto",
              height: "80%",
            }}
          >
            <Divider />
            <TextareaAutosize
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={css({
                fontFamily: "Roboto",
                width: "90%",
                margin: "10px",
                resize: "none",
                border: "none",
                ":focus": { outline: "none" },
              })}
              placeholder={`What's on your mind, ${name}?`}
            ></TextareaAutosize>
            <Media mediaPath={mediaPath} mediaType={media?.type} />
          </CardContent>
          <div
            className={css({
              position: "absolute",
              right: "0",
              left: "0",
              bottom: "0",
              marginBottom: "10px",
            })}
          >
            {/* <ErrorDisplay content={error?.message} /> */}
            <Button
              variant="contained"
              sx={{ width: "calc(90% - 30px)" }}
              onClick={post}
              disabled={isLoading}
            >
              Post
            </Button>
            <UploadMedia
              setMedia={setMedia}
              setMediaPath={setMediaPath}
            />
          </div>
        </Card>
      </Modal>
    </>
  );
};

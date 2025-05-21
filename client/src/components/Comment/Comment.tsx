import { Avatar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getTime } from "../../utils/utils";
import { Media } from "../Media";
import { CommentDto } from '../../types';

export const Comment = ({ comment, prevId }: { comment: CommentDto; prevId?: string | null }) => {
  return (
    <Box ml={2} mt={2} display="flex" width={"100%"}>
      <Box sx={{ width: "30px", height: "30px" }}>
        {prevId !== comment.commentedBy.id && (
          <Avatar
            src={comment.commentedBy.picture || ''}
            sx={{ width: "100%", height: "100%" }}
          />
        )}
      </Box>
      <Box ml={1}>
        <Box
          sx={{
            borderRadius: "10px",
            bgcolor: "#eee",
            p: 1,
            minWidth: "150px",
            maxWidth: "60%",
            " > *": { fontFamily: "Roboto !important" },
          }}
        >
          <Typography
            component={"div"}
            fontWeight={600}
            fontSize={13}
            whiteSpace="pre-wrap"
          >
            {comment.commentedBy.username}
          </Typography>
          <Typography fontSize={12}>{comment.content}</Typography>
        </Box>
        <Box width={"100px"} mb={"5px"}>
          <Media mediaPath={'http://localhost:3000' + comment.media} mediaType={comment.mediaType} />
        </Box>
        <Typography fontSize={9} ml={"10px"}>
          {getTime(comment.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
};

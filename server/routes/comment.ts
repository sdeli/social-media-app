import express from "express";
import { commentsPerPage } from "../constants";
import { Comment } from "../models/Comment";
import { User } from "../models/User";
import { GetCommentsDto, PostCommentDto } from '../dto';
import multer from "multer";
import { storeFS } from "../utils/storeFS";
import { Readable } from "stream";

export const commentRouter = express.Router();

commentRouter.get("/api/comment", async (req, res, next) => {
  const params = {
    page: parseInt(req.query.page as string),
    user: parseInt(req.query.user as string),
    postId: parseInt(req.query.user as string)
  } as GetCommentsDto;

  const { page, user, postId } = params;
  if (page === undefined || user === undefined || postId === undefined) {
    res.status(400).send('Bad request exception')
    return;
  }

  const comments = await Comment.findAll({
    where: { postId },
    order: [["createdAt", "desc"]],
    include: User,
    limit: commentsPerPage,
    offset: page * commentsPerPage,
  });

  res.json(comments)
});

commentRouter.post("/api/comment", async (req, res, next) => {
  const params = {
    user: req.body.user as number,
    postId: req.body.postId as number,
    content: req.body.content as string,
    media: req.body.media as any,
  } as PostCommentDto;

  const { user, postId, content, media } = params;
  if (user === undefined || postId === undefined || content === undefined) {
    res.status(400).send('Bad request exception')
    return;
  }

  const commentedBy = user;

  let mediaUrl = null,
    mediaType = null;
  if (media) {
    const { filename, createReadStream, mimetype } = await media.promise;
    const stream = createReadStream();
    const path = await storeFS({ stream, filename });
    mediaUrl = path.path;
    mediaType = mimetype;
  }

  const comment = await Comment.create({
    commentedBy,
    postId,
    content,
    media: mediaUrl,
    mediaType,
  });

  const _comment = await Comment.findByPk(comment.id, { include: User });

  res.json(_comment)
});
import express from "express";
import { Sequelize, Op } from "sequelize";
import { commentsPerPage, postsPerPage } from "../constants";
import { Comment } from "../models/Comment";
import { FriendshipStatus } from "../models/ENUMS";
import { Friendship } from "../models/Friendship";
import { Like_Dislike } from "../models/Like_Dislike";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { GetCommentsDto, GetPostsDto, LikePostsDto, savePostsDto } from '../dto';
import multer from "multer";
import { storeFS } from "../utils/storeFS";
import { Readable } from "stream";

export const commentRouter = express.Router();

commentRouter.get("/api/comment", async (req, res, next) => {
  console.log('query ============')
  console.log(req.query);
  const params = {
    page: parseInt(req.query.page as string),
    user: parseInt(req.query.user as string),
    postId: parseInt(req.query.user as string)
  } as GetCommentsDto;
  console.log('params')
  console.log(params);
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
  console.log('comments')
  console.log(comments);
  res.json(comments)
});
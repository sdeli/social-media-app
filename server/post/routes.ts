import express from "express";
import { Sequelize, Op } from "sequelize";
import { postsPerPage } from "../constants";
import { Comment } from "../models/Comment";
import { FriendshipStatus } from "../models/ENUMS";
import { Friendship } from "../models/Friendship";
import { Like_Dislike } from "../models/Like_Dislike";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { getPostsDto, savePostsDto } from '../dto';
import multer from "multer";
import { storeFS } from "../utils/storeFS";
import { Readable } from "stream";

const upload = multer();
export const postRouter = express.Router();

postRouter.post("/api/posts", upload.single("media"), async (req, res) => {
  try {
    const body = req.body as savePostsDto
    const user = body.user; // assuming you're using passport
    const content = body.content;
    const mediaFile = req.file as Express.Multer.File;

    if (!content && !mediaFile) {
      return res.status(400).json({ error: "Post must have content or media" });
    }

    let mediaUrl: string | null = null;
    let mediaType: string | null = null;

    if (mediaFile) {
      const stream = Readable.from(mediaFile.buffer);
      const path = await storeFS({ stream, filename: mediaFile.originalname });
      mediaUrl = path.path;
      mediaType = mediaFile.mimetype;
    }

    const post = await Post.create({
      postedBy: user,
      content,
      media: mediaUrl,
      mediaType,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

postRouter.get("/api/posts", async (req, res, next) => {
  const params = {
    page: parseInt(req.query.page as string),
    user: parseInt(req.query.user as string)
  } as getPostsDto;

  const { page, user } = params;
  if (page === undefined || user === undefined) {
    res.status(400).send('Bad request exception')
    return;
  }

  const friends = await Friendship.findAll({
    where: Sequelize.and(
      {
        status: FriendshipStatus.Accepted,
      },
      Sequelize.or(
        {
          requestedBy: user,
        },
        { acceptedBy: user }
      )
    ),
  });

  const friendIds = friends.map((friend) =>
    user === friend.requestedBy ? friend.acceptedBy : friend.requestedBy
  );
  console.log('postsPerPage')
  console.log(page * postsPerPage);
  const posts = await Post.findAll({
    // where: {
    //   postedBy: {
    //     [Op.in]: friendIds,
    //   },
    // },
    include: User,
    order: [["createdAt", "DESC"]],
    limit: postsPerPage,
    offset: page * postsPerPage,
  });
  console.log('posts =====')
  console.log(posts);
  const dtos = [];

  for (let i = 0; i < posts.length; i++) {
    const currentPost = {
      ...posts[i].dataValues
    }

    const lastComment = await Comment.findOne({
      where: {
        postId: currentPost.id,
      },
      include: User,
      order: [["createdAt", "DESC"]],
    });

    const like = await Like_Dislike.findOne({
      where: { userId: user, postId: currentPost.id },
    });


    currentPost.hasLiked = like?.isLike;
    currentPost.lastComment = lastComment;
    dtos.push(currentPost)
  }

  res.json(dtos)
});
import express from "express";
import { Sequelize, Op } from "sequelize";
import { postsPerPage } from "../constants";
import { Comment } from "../models/Comment";
import { FriendshipStatus } from "../models/ENUMS";
import { Friendship } from "../models/Friendship";
import { Like_Dislike } from "../models/Like_Dislike";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { GetPostsDto, LikePostsDto, SavePostDto } from '../dto';
import multer from "multer";
import { storeFS } from "../utils/storeFS";
import { Readable } from "stream";

const upload = multer();
export const postRouter = express.Router();

postRouter.post("/api/post", upload.single("media"), async (req, res) => {
  try {
    const body = req.body as SavePostDto
    const user = body.user;
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

postRouter.get("/api/post", async (req, res, next) => {
  const params = {
    page: parseInt(req.query.page as string),
    user: parseInt(req.query.user as string)
  } as GetPostsDto;

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

postRouter.post("/api/post/like", async (req, res, next) => {
  const params = {
    postId: req.body.postId as number,
    isLike: req.body.isLike as boolean,
    user: req.body.user as number,
  } as LikePostsDto;

  const { postId, user, isLike } = params;
  if (postId === undefined || user === undefined || isLike === undefined) {
    res.status(400).send('Bad request exception')
    return;
  }

  const post = await Post.findByPk(postId);
  if (!post) throw new Error("post doesn't exist");

  const like_dislike = await Like_Dislike.findOne({
    where: {
      postId,
      userId: user,
    },
  });

  if (!like_dislike) {
    await Like_Dislike.create({
      postId,
      isLike,
      userId: user,
    });

    isLike
      ? await post.increment("likes")
      : await post.increment("dislikes");
  } else {
    if (isLike === like_dislike.isLike) {
      like_dislike.destroy();
      isLike
        ? await post.decrement("likes")
        : await post.decrement("dislikes");
    } else {
      await like_dislike.update({ isLike });
      if (isLike) {
        await post.increment("likes");
        await post.decrement("dislikes");
      } else {
        await post.increment("dislikes");
        await post.decrement("likes");
      }
    }
  }
  await post.reload();

  const like = await Like_Dislike.findOne({
    where: { userId: user, postId: post.id },
  });


  post.dataValues.hasLiked = like?.isLike;

  res.json(post.dataValues)
})
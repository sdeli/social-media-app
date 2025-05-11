import { Router } from 'express';

import { Sequelize, Op } from "sequelize";
import { postsPerPage } from "../constants";
import { Comment } from "../models/Comment";
import { FriendshipStatus } from "../models/ENUMS";
import { Friendship } from "../models/Friendship";
import { Like_Dislike } from "../models/Like_Dislike";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { SavePostDto } from '../dto';

export const postRouter = Router();
postRouter.get("/api/posts", async (req, res, next) => {
  const params = {
    page: parseInt(req.query.page as string),
    user: parseInt(req.query.user as string)
  } as SavePostDto;

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
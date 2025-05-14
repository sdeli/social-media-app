import express from "express";
import { Op } from "sequelize";
import { FriendshipStatus } from "../models/ENUMS";
import { Friendship } from "../models/Friendship";
import { User } from "../models/User";
import { GetFriendsDto } from '../dto';

export const userRouter = express.Router();

userRouter.get("/api/user/friends", async (req, res, next) => {
  const params = {
    query: req.query.query as string || null,
    user: parseInt(req.query.user as string)
  } as GetFriendsDto;

  const { query, user } = params;
  if (user === undefined) {
    res.status(400).send('Bad request exception')
    return;
  }

  const friendshipList = await Friendship.findAll({
    where: {
      [Op.and]: [
        { status: FriendshipStatus.Accepted },
        { [Op.or]: [{ requestedBy: user }, { acceptedBy: user }] },
      ],
    },
  });

  const friendsListIds = friendshipList.map((friendship) =>
    friendship.requestedBy === user
      ? friendship.acceptedBy
      : friendship.requestedBy
  );

  const where = {
    [Op.and]: [
      { id: { [Op.in]: friendsListIds } },
    ] as any[],
  }

  if (query) {
    where[Op.and].push({ name: { [Op.like]: `%${query}%` } })
  }

  const friendsList = await User.findAll({
    where,
    order: [["name", "ASC"]],
  });

  res.json(friendsList)
});
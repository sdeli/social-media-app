import express from "express";
import { Friendship } from "../models/Friendship";
import { GetFriendshipsStatusDto, SendFriendshipRequestDto } from '../dto';
import { Op } from 'sequelize';
import { FriendshipStatus } from '../models/ENUMS';
import { User } from '../models/User';

export const friendshipRouter = express.Router();

friendshipRouter.post("/api/friendship/request", async (req, res, next) => {
  if (!req.body.acceptedBy || !req.body.user) {
    res.status(400).send('Bad request exception')
    return;
  }
  const params = {
    acceptedBy: parseInt(req.body.acceptedBy as string),
    user: parseInt(req.body.user as string)
  } as SendFriendshipRequestDto;

  const { user, acceptedBy } = params;
  try {
    const friendRequest = await Friendship.create({
      requestedBy: user,
      acceptedBy,
    });
    res.json(friendRequest)
  } catch (e) {
    throw e;
  }
});

friendshipRouter.get("/api/friendship", async (req, res, next) => {
  if (req.query.query === undefined || !req.query.user) {
    console.log('bad');
    res.status(400).send('Bad request exception')
    return;
  }

  const params = {
    query: req.query.query as string,
    user: parseInt(req.query.user as string)
  } as GetFriendshipsStatusDto;

  const { user, query } = params;

  const friendShips = await Friendship.findAll({
    where: {
      [Op.or]: [{ requestedBy: user }, { acceptedBy: user }],
    },
  });

  const acceptedFriends = friendShips
    .filter((friendship) => friendship.status === FriendshipStatus.Accepted)
    .map((friendship) =>
      friendship.requestedBy === user
        ? friendship.acceptedBy
        : friendship.requestedBy
    );

  const users = await User.findAll({
    where: {
      id: { [Op.notIn]: acceptedFriends.concat(user) },
      ...(query.length && { name: { [Op.like]: `%${query}%` } }),
    },
    order: [["name", "ASC"]],
  });

  const friendShipStatues = users.map((user) => {
    const friendship = friendShips.find((friendship) => user.id === friendship.requestedBy || user.id === friendship.acceptedBy);

    return {
      ...user.dataValues,
      status: friendship?.status,
    };
  });

  res.json(friendShipStatues)
});
import express from "express";
import { Friendship } from "../models/Friendship";
import { SendFriendshipRequestDto } from '../dto';

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
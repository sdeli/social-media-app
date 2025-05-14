import express from "express";
import { Op } from "sequelize";
import { FriendshipStatus } from "../models/ENUMS";
import { Friendship } from "../models/Friendship";
import { User } from "../models/User";
import { EditUserDto, GetFriendsDto } from '../dto';
import { checkPassword, encrypt } from '../utils/encrypt';
import { storeFS } from '../utils/storeFS';

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

userRouter.post("/api/user/edit", async (req, res, next) => {
  if (req.body.name === undefined || req.body.prevPassword === undefined || req.body.newPassword === undefined || req.body.confirmPassword === undefined || req.body.picture === undefined || req.body.user === undefined) {
    res.status(500).send();
    return;
  }

  const params = req.body as EditUserDto;
  const name = params.name;
  const prevPassword = params.prevPassword;
  const newPassword = params.newPassword;
  const confirmPassword = params.confirmPassword;
  const picture = params.picture;
  const user = params.user;

  const userDoc = await User.findByPk(user);

  if (!userDoc) throw new Error("No user record");

  if (newPassword) {
    const passwordCorrect = await checkPassword(
      userDoc.password,
      prevPassword
    );
    if (!passwordCorrect) throw new Error("previous password wrong");

    if (newPassword !== confirmPassword)
      throw new Error("new password and confirm password unequal.");
  }

  let pictureUrl;

  if (picture) {
    const { createReadStream, filename } = await picture.promise;
    const stream = createReadStream();
    const { path } = await storeFS({ stream, filename });
    pictureUrl = path;
  }

  const hashedPassword = await encrypt(newPassword);

  await userDoc.update({
    ...(name && { name }),
    ...(pictureUrl && { picture: pictureUrl }),
    ...(newPassword && { password: hashedPassword }),
  });
  res.json(userDoc)

});
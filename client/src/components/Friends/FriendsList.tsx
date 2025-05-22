import { gql, useQuery } from "@apollo/client";
import { Avatar, Box, Button, Card, Divider, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getFriendsList__api } from '../../api/userApi';
import { FriendshipDto, FriendshipStatus, UserDto } from '../../types';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import { useAppDispatch } from '../../store/hooks';
import { getAllFriendShipsAction, setfriendsQueryAction } from '../../store/friendshipsActions';
import { selectFriendships, selectFriendsQuery } from '../../store/friendshipSlice';

export const FriendsList = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const friendships = useSelector(selectFriendships);
  const [friends, setFriends] = useState<UserDto[]>([]);
  const query = useSelector(selectFriendsQuery);

  useEffect(() => {
    dispatch(getAllFriendShipsAction({ user: user.id }))
  }, [])

  useEffect(() => {
    const friends = getFriends(friendships)
    const _friends = filterFriends(friends, query);

    setFriends(_friends);
  }, [friendships])

  function searchHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    dispatch(setfriendsQueryAction(query)).then(() => {
      const friends = getFriends(friendships);
      const _friends = filterFriends(friends, query);
      setFriends(_friends);
    })
  };

  function filterFriends(friends: UserDto[], query: string) {
    return friends.filter(friend => friend.username?.includes(query))
  }

  function getFriends(friendships: FriendshipDto[]) {
    return friendships
      .filter((fShip) => fShip.status === FriendshipStatus.Accepted)
      .map(fShip => {
        const isUser = fShip.requestedBy.id === user.id
        if (isUser) {
          return fShip.acceptedBy;
        } else {
          return fShip.requestedBy;
        }
      })
  }

  return (
    <>
      <input
        placeholder="Search for friends"
        className="search-input"
        value={query}
        onChange={searchHandler}
      />
      <Divider sx={{ marginBlock: 2 }} />
      <Box display="flex" alignItems="center" flexDirection="column">
        {!friends.length && (
          <Typography textAlign={"center"} marginTop={2}>
            No results
          </Typography>
        )}
        {friends.length && friends.map(
          (friend) => (
            <Card
              elevation={3}
              key={friend.id}
              sx={{
                p: 4,
                display: "flex",
                alignItems: "center",
                minWidth: "300px",
                my: 1,
              }}
            >
              <Avatar src={friend.picture || ''} />
              <Box marginLeft="auto">
                <Typography textAlign="center" mb={1}>
                  {friend.username ? friend.username : 'Anonymus'}
                </Typography>
                <Link
                  to={`/account/friends/${friend.id}`}
                  state={{ name: friend.username || 'Anonymus', picture: friend.picture || '' }}
                >
                  See detail
                </Link>
              </Box>
            </Card>
          )
        )}
      </Box>
    </>
  );
};
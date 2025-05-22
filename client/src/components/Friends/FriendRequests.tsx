import { gql, useMutation } from "@apollo/client";
import { Avatar, Box, Button, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { acceptFriendshipRequests__api } from '../../api/friendshipApi';
import { FriendshipDto, FriendshipStatus } from '../../types';
import { selectUser } from '../../store/userSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';
import { acceptFriendshipRequestsAction, getAllFriendShipsAction } from '../../store/friendshipsActions';
import { selectFriendships, selectFriendsQuery } from '../../store/friendshipSlice';

export const FriendRequests = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsloading] = useState<boolean>(false);
  const currUser = useSelector(selectUser);
  if (!currUser) return <></>;
  const [disableList, setDisableList] = useState<number[]>([]);
  const friendships = useSelector(selectFriendships);
  const [friendshipRequests, setFriendshipRequests] = useState<FriendshipDto[]>([]);

  useEffect(() => {
    const _friendshipRequests = getFriendshipRequests(friendships);
    setFriendshipRequests(_friendshipRequests);
  }, [friendships])

  useEffect(() => {
    dispatch(getAllFriendShipsAction({ user: currUser.id }))
  }, [])

  function accept(friendshipId: number, accept: boolean = true) {
    setIsloading(true);

    dispatch(acceptFriendshipRequestsAction({ user: currUser.id, accepted: accept, friendshipId }))
      .then((res) => {
        if (res) {
          setDisableList(disableList.concat(friendshipId));
          setIsloading(false);
        } else {
          setIsloading(false);
        }
      })
  };

  function getFriendshipRequests(_friendships: FriendshipDto[]) {
    return _friendships.filter((fShip) => {
      return fShip.status === FriendshipStatus.Requested && fShip.requestedBy.id !== currUser.id
    })
  }

  if (!friendshipRequests.length)
    return (
      <Typography textAlign={"center"} marginTop={2}>
        No Friend Requests
      </Typography>
    );

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      {friendshipRequests.map((friendship) => {
        return (
          <Card
            elevation={3}
            key={friendship.id}
            sx={{
              p: 4,
              display: "flex",
              alignItems: "center",
              minWidth: "300px",
              my: 1,
            }}
          >
            <Avatar src={friendship.requestedBy.picture || ''} />
            <Box marginLeft="auto">
              <Typography textAlign="center" mb={1}>
                {friendship.requestedBy.username || 'Anonymus'}
              </Typography>
              <Button
                sx={{ fontSize: "10px" }}
                variant="contained"
                size="small"
                onClick={(e) => accept(friendship.id)}
                disabled={disableList.includes(friendship.id)}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                sx={{
                  marginLeft: 1,
                  fontSize: "10px",
                  bgcolor: "#919191",
                }}
                size="small"
                onClick={(e) =>
                  accept(friendship.id, false)
                }
                disabled={disableList.includes(friendship.id)}
              >
                Reject
              </Button>
            </Box>
          </Card>
        )
      }
      )}
    </Box>
  );
};

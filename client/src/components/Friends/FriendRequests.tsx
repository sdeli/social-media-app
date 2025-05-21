import { gql, useMutation } from "@apollo/client";
import { Avatar, Box, Button, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { acceptFriendshipRequests__api, getFriendshipRequests__api } from '../../api/friendshipApi';
import { FriendshipDto } from '../../types';
import { selectUser } from '../../store/userSlice';
import { useSelector } from 'react-redux';

export const FriendRequests = () => {
  const [friendships, setFriendships] = useState<FriendshipDto[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const _user = useSelector(selectUser);
  if (!_user) return <></>;
  const [disableList, setDisableList] = useState<number[]>([]);

  const sendRequest = (friendshipId: number, accept: boolean = true) => {
    setDisableList(disableList.concat(friendshipId));
    setIsloading(true);
    acceptFriendshipRequests__api({ user: _user.id, accepted: accept, friendshipId })
      .then((_friendship) => {
        if (!_friendship) return;
        const _friendships = friendships.filter((fship) => fship.id !== _friendship.id)
        setFriendships(_friendships);
        setIsloading(false);
      })
  };

  useEffect(() => {
    getFriendshipRequests__api({ user: _user.id }).then((friendshipReq) => {
      if (!friendshipReq) return;
      setFriendships(friendshipReq)
    })
  }, [])

  useEffect(() => {
    if (isLoading) return;
    // setDisableList(disableList.filter((v) => v !== friendshipId));
  }, [isLoading]);

  if (!friendships.length)
    return (
      <Typography textAlign={"center"} marginTop={2}>
        No Friend Requests
      </Typography>
    );

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      {friendships.map((friendship) => {
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
            <Avatar src={friendship.RequestedUser?.picture || ''} />
            <Box marginLeft="auto">
              <Typography textAlign="center" mb={1}>
                {friendship.RequestedUser.username || 'Anonymus'}
              </Typography>
              <Button
                sx={{ fontSize: "10px" }}
                variant="contained"
                size="small"
                onClick={(e) => sendRequest(friendship.id)}
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
                  sendRequest(friendship.id, false)
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

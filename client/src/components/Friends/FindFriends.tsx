import { Avatar, Box, Button, Card, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getFriendshipStatuses__api, sendFriendRequest__api } from '../../api/friendshipApi';
import { FriendshipStatus, FriendShipStatusDto, SendFriendshipRequestDto, UserDto } from '../../types';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import { FetchType, useScrollFetchRest } from '../../hooks/useScrollFetchRest';
import { selectFriendships, selectFriendsQuery, selectPossibleFriends, selectPossibleFriendsQuery } from '../../store/friendshipSlice';
import { cleanupPossibleFriendsAction, fetchPossibleFriendsAction, getAllFriendShipsAction, sendFriendRequestAction, setfriendsQueryAction, setPossiblefriendsQueryAction } from '../../store/friendshipsActions';
import { useAppDispatch } from '../../store/hooks';

enum SendButtonText {
  sendRequest = 'Send Request',
  requestRejected = 'Request Rejected',
  requestSent = 'Request Sent',
  waitingForAnswer = 'Waiting For Answer'
}

export const FindFriends = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  if (!user.id) return <></>
  const possibleFriends = useSelector(selectPossibleFriends);
  const [_possibleFriends, setPossibleFriends] = useState<UserDto[]>([]);
  const query = useSelector(selectPossibleFriendsQuery);

  const { refAnchor, noMoreData } = useScrollFetchRest({ userId: user.id, fetchType: FetchType.FRIENDS, query });
  const _friendships = useSelector(selectFriendships);

  useEffect(() => {
    if (query) {
      setPossibleFriends(filterFriends(possibleFriends, query));
    } else {
      setPossibleFriends(possibleFriends);
    }
  }, [possibleFriends])

  useEffect(() => {
    dispatch(getAllFriendShipsAction({ user: user.id }))
      .then(() => {
        dispatch(cleanupPossibleFriendsAction(user));
      })
  }, [])


  function searchHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    dispatch(setPossiblefriendsQueryAction(query)).then(() => {
      const friends = filterFriends(possibleFriends, query);
      setPossibleFriends(friends);
    })
  };

  function sendRequest(acceptedBy: string, user: string) {
    const dto: SendFriendshipRequestDto = { user, acceptedBy };

    dispatch(sendFriendRequestAction(dto));
  };

  function getRequestStatus(possibleFriend: UserDto): SendButtonText | false {
    const hasRequest = _friendships.find(fShip => {
      return fShip.acceptedBy.id === possibleFriend.id || fShip.requestedBy.id === possibleFriend.id;
    })

    if (hasRequest) {
      if (hasRequest.status === FriendshipStatus.Blocked) {
        return SendButtonText.requestRejected
      }
      if (hasRequest.status === FriendshipStatus.Requested) {
        if (hasRequest.requestedBy.id === user.id) {
          return SendButtonText.requestSent
        } else {
          return SendButtonText.waitingForAnswer
        }
      }

      return false
    } else {
      return SendButtonText.sendRequest;
    }
  }

  function filterFriends(friends: UserDto[], query: string) {
    return friends.filter(friend => friend.username?.includes(query))
  }

  function possibleFriendsList() {
    return _possibleFriends.map((possibleFriend) => {
      const buttonMessage = getRequestStatus(possibleFriend);
      const idButtonDisabled = buttonMessage !== SendButtonText.sendRequest;
      return (
        <Card
          elevation={3}
          key={possibleFriend.id}
          sx={{
            p: 4,
            display: "flex",
            alignItems: "center",
            minWidth: "300px",
            my: 1,
          }}
        >
          {possibleFriend.picture &&
            <Avatar src={possibleFriend.picture} />
          }
          <Box marginLeft="auto">
            <Typography textAlign="center" mb={1}>
              {possibleFriend.username}
            </Typography>
            {buttonMessage &&
              <Button
                variant="contained"
                size="small"
                disabled={idButtonDisabled}
                onClick={() => {
                  if (idButtonDisabled) return;
                  sendRequest(possibleFriend.id, user.id)
                }}
              >
                {buttonMessage}
              </Button>
            }
          </Box>
        </Card>)
    });
  }

  return (
    <>
      <input
        placeholder="Search for new friends 222"
        className="search-input"
        onChange={searchHandler}
      />

      <Divider sx={{ marginBlock: 2 }} />
      <Box display="flex" alignItems="center" flexDirection="column">
        {!possibleFriends.length && (
          <Typography textAlign={"center"} marginTop={2}>
            No results
          </Typography>
        )}

        {possibleFriendsList()}

        {noMoreData ? (
          <Typography textAlign="center" mt={2} ref={refAnchor}>
            No {possibleFriends.length > 0 && "more "} possible Friends
          </Typography>
        ) : (
          <Typography textAlign="center" ref={refAnchor}>
            {/* <Typography textAlign="center"> */}
            Loading ...
          </Typography>
        )}
      </Box>
    </>
  );
};

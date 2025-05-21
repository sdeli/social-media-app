import { Avatar, Box, Button, Card, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getFriendshipStatuses__api, sendFriendRequest__api } from '../../api/friendshipApi';
import { FriendShipStatusDto, SendFriendshipRequestDto, UserDto } from '../../types';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import { FetchType, useScrollFetchRest } from '../../hooks/useScrollFetchRest';
import { selectFriendships, selectPossibleFriends } from '../../store/friendshipSlice';

export const FindFriends = () => {
  const user = useSelector(selectUser);
  if (!user.id) return <></>
  const possibleFriends = useSelector(selectPossibleFriends);

  const [query, setQuery] = useState("");

  const { refAnchor, noMoreData, page } = useScrollFetchRest({ userId: user.id, fetchType: FetchType.FRIENDS, query });
  const [loadingList, setLoadingList] = useState<string[]>([]);
  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingList([]);

    const query = e.target.value;
    setQuery(query);
    page.current = 0;
  };

  const sendRequest = (acceptedBy: string, user: string) => {
    const dto: SendFriendshipRequestDto = { user, acceptedBy };
    setLoadingList(loadingList.concat(acceptedBy));

    sendFriendRequest__api(dto).then((friendRequest) => {
      if (!friendRequest) return;
      const acceptedBy = friendRequest.acceptedBy;
      setLoadingList(loadingList.filter((id) => acceptedBy !== id));
    })
  };

  function possibleFriendsList() {
    return possibleFriends.map((userDto) => (
      <Card
        elevation={3}
        key={userDto.id}
        sx={{
          p: 4,
          display: "flex",
          alignItems: "center",
          minWidth: "300px",
          my: 1,
        }}
      >
        {userDto.picture &&
          <Avatar src={userDto.picture} />
        }
        <Box marginLeft="auto">
          <Typography textAlign="center" mb={1}>
            {userDto.username}
          </Typography>
          <Button
            variant="contained"
            size="small"
            disabled={!!status || loadingList.includes(userDto.id)}
          // onClick={() => sendRequest(id)}
          >
            {loadingList.includes(userDto.id)
              ? "Sending"
              : !status
                ? "Send Request"
                : status.includes("rejected")
                  ? "Request rejected"
                  : "Request Sent"}
          </Button>
        </Box>
      </Card>
    ));
  }

  return (
    <>
      <input
        placeholder="Search for new friends 222"
        className="search-input"
        onChange={searchHandler}
      />

      <Divider sx={{ marginBlock: 2 }} />
      <p>page: {page.current} - {noMoreData}</p>
      <Box display="flex" alignItems="center" flexDirection="column">
        {!possibleFriends.length && (
          <Typography textAlign={"center"} marginTop={2}>
            No results
          </Typography>
        )}

        {possibleFriendsList()}
        <p>page: {page.current} - {noMoreData}</p>
        {noMoreData ? (
          <Typography textAlign="center" mt={2}>
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

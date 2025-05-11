import { Avatar, Box, Button, Card, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getFriendshipStatuses__api, sendFriendRequest__api } from '../../api/friendshipApi';
import { FriendShipStatusDto, SendFriendshipRequestDto } from '../../types';

export const FindFriends = () => {
  const [data, setData] = useState<FriendShipStatusDto[]>([]);
  const [query, setQuery] = useState("");

  const [loadingList, setLoadingList] = useState<number[]>([]);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingList([]);

    const query = e.target.value;
    setQuery(query);

    getFriendshipStatuses__api({ query, user: 1 })
      .then((fStatus) => {
        if (!fStatus) return;
        setData(fStatus);
      })
  };

  const sendRequest = (acceptedBy: number, user: number = 1) => {
    const dto: SendFriendshipRequestDto = { user, acceptedBy };
    setLoadingList(loadingList.concat(acceptedBy));
    sendFriendRequest__api(dto).then((friendRequest) => {
      if (!friendRequest) return;
      const acceptedBy = friendRequest.acceptedBy;
      setLoadingList(loadingList.filter((id) => acceptedBy !== id));
    })
  };

  useEffect(() => {
    getFriendshipStatuses__api({ query, user: 1 })
      .then((fStatus) => {
        if (!fStatus) return;
        setData(fStatus);
      })
  }, [query])

  function possibleFriendsList() {
    return data.map(({ id, name, picture, status }) => (
      <Card
        elevation={3}
        key={id}
        sx={{
          p: 4,
          display: "flex",
          alignItems: "center",
          minWidth: "300px",
          my: 1,
        }}
      >
        {picture &&
          <Avatar src={picture} />
        }
        <Box marginLeft="auto">
          <Typography textAlign="center" mb={1}>
            {name}
          </Typography>
          <Button
            variant="contained"
            size="small"
            disabled={!!status || loadingList.includes(id)}
            onClick={() => sendRequest(id)}
          >
            {loadingList.includes(id)
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
      <Box display="flex" alignItems="center" flexDirection="column">
        {!data.length && (
          <Typography textAlign={"center"} marginTop={2}>
            No results
          </Typography>
        )}
        {possibleFriendsList()}

      </Box>
    </>
  );
};

import { gql, useQuery } from "@apollo/client";
import { Avatar, Box, Button, Card, Divider, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getFriendsList__api } from '../../api/userApi';
import { UserDto } from '../../types';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';


export const FriendsList = () => {
  const user = useSelector(selectUser);
  const [data, setFriends] = useState<UserDto[]>([]);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    getFriendsList__api({ user: user.id, query })
      .then((friends) => {
        if (!friends || typeof friends === 'string') return;
        setFriends(friends);
      })
  };

  useEffect(() => {
    getFriendsList__api({ user: user.id })
      .then((friends) => {
        if (!friends || typeof friends === 'string') return;
        setFriends(friends);
      })
  }, [])

  return (
    <>
      <input
        placeholder="Search for friends"
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
        {data.length && data.map(
          (user) => (
            <Card
              elevation={3}
              key={user.id}
              sx={{
                p: 4,
                display: "flex",
                alignItems: "center",
                minWidth: "300px",
                my: 1,
              }}
            >
              <Avatar src={user.picture || ''} />
              <Box marginLeft="auto">
                <Typography textAlign="center" mb={1}>
                  {user.name ? user.name : 'Anonymus'}
                </Typography>
                <Link
                  to={`/account/friends/${user.id}`}
                  state={{ name: user.name || 'Anonymus', picture: user.picture || '' }}
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
import { Avatar, IconButton, Menu, MenuItem, MenuList } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useState } from "react";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";
import { css } from "@emotion/css";
import { logout, selectUser } from "./../store/userSlice";

export const AvatarMenu = () => {
  const user = useSelector(selectUser);
  console.log('user')
  console.log(user);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      await axios.post("/api/logout");

      dispatch(logout);

      navigate("/login");
      location.reload();
    } catch (e) { }
  };

  return (
    <div>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className={css({ ":focus": { outline: "none" } })}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ fontSize: '16px', margin: '0px' }}>{user.username}</p>
          <p style={{ fontSize: '16px', margin: '0px' }}>{user.email}</p>
        </div>
        {
          user.picture &&
          <Avatar src={user.picture} />
        }
      </IconButton>
      <Menu
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorEl={anchorEl}
      >
        <MenuList>
          <Link to="/profile" className={css({ color: "black" })}>
            <MenuItem>Edit Profile</MenuItem>
          </Link>
          <MenuItem
            onClick={logoutHandler}
            className={css({ color: "black" })}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

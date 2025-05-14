import { css } from "@emotion/css";
import { Avatar, Button, FormControl, FormLabel, Input } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useState } from "react";
import { gql } from "@apollo/client";
import { setProfile } from "../store/userSlice";
import { editUser__api } from '../api/userApi';
import { EditUserDto } from '../types';

export const EditProfile = () => {
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const [pictureUrl, setPictureUrl] = useState(user.picture);
  const [pictureFile, setPictureFile] = useState<Blob | null>(null);
  const [formState, setFormState] = useState<EditUserDto>({
    name: user.name,
    prevPassword: "",
    newPassword: "",
    confirmPassword: "",
    picture: null,
    user: user.id
  });

  const dispatch = useDispatch();
  const changeFormState = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };


  const changePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    // reset();
    const file = e.target.files?.[0] as Blob;
    if (!file) return;
    setPictureFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPictureUrl(reader.result as string);
    };
  };

  const editProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editUser__api(formState).then(userData => {
      if (!userData) return;
      setFormState((prevData) => ({
        name: userData.name || '',
        prevPassword: "",
        newPassword: "",
        confirmPassword: "",
        picture: null,
        user: prevData.user  // or prevData.id if you meant that
      }));

      dispatch(setProfile({ dto: userData }));
    })
  };

  return (
    <form
      onSubmit={editProfile}
      className={css({
        display: "flex",
        flexDirection: "column",
        marginTop: "50px",
        marginInline: "auto",
        paddingInline: "20px",
        width: "100%",
        maxWidth: "400px",
        alignItems: "center",
        "& > div": {
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBlock: "30px",
        },
      })}
    >
      {/* <ErrorDisplay content={error?.message} /> */}
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          name="name"
          onChange={changeFormState}
          value={formState.name}
        ></Input>
      </FormControl>
      <FormControl>
        <FormLabel>New Password</FormLabel>
        <Input
          type="password"
          name="newPassword"
          onChange={changeFormState}
          value={formState.newPassword}
        ></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          name="confirmPassword"
          onChange={changeFormState}
          value={formState.confirmPassword}
        ></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Prev Password</FormLabel>
        <Input
          type="password"
          name="prevPassword"
          onChange={changeFormState}
          value={formState.prevPassword}
        ></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Avatar</FormLabel>
        <FormLabel
          sx={{ marginInlineEnd: "20%", cursor: "pointer" }}
          htmlFor="picture"
        >
          <Avatar src={pictureUrl} />
        </FormLabel>
        <input
          type="file"
          id="picture"
          className={css({ display: "none" })}
          name="picture"
          onChange={changePicture}
          accept="image/*"
        />
      </FormControl>
      <Button sx={{ marginBlock: 4 }} variant="contained" type="submit">
        Update Profile
      </Button>
    </form>
  );
};

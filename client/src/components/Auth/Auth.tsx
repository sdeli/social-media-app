import { Box, Container, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { FieldValues } from "react-hook-form/dist/types";
import { useEffect, useState } from "react";
import axios from "../../axios";
import { useNavigate, Link } from "react-router-dom";
import { ErrorDisplay } from "../ErrorDisplayer";
import { LoginDto } from '../../types';
import { postLoginData } from '../../api/authApi';
import { selectUser, setCurrentUser } from '../../store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { store } from '../../store/store';

export const Auth = ({
  url,
  label,
  isLogin = false,
}: {
  url: string;
  label: string;
  isLogin?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (user) {
    navigate("/");
  }
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state.user) {
        console.log('sannya');
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const onSubmit = async (data: FieldValues) => {
    setBackendError("");
    const { email, password } = data;
    const dto: LoginDto = {
      email: email || 'test31881@example.com',
      password: password || 'test',
      username: 'test'
    }

    try {
      const res = await postLoginData(dto);

      dispatch(setCurrentUser({
        id: res.user.id,
        name: res.user.username,
        picture: res.user.picture,
        email: res.user.email
      }))
    } catch (e: any) {
      setBackendError(e?.response?.data || "Error Occurred");
    }
  };

  async function login(data: LoginDto) {
    setBackendError("");
    const { email, password } = data;
    const dto: LoginDto = {
      email: email || 'test31881@example.com',
      password: password || 'test',
      username: 'test'
    }

    try {
      const res = await postLoginData(dto);

      dispatch(setCurrentUser({
        id: res.user.id,
        name: res.user.username,
        picture: res.user.picture,
        email: res.user.email
      }))
    } catch (e: any) {
      setBackendError(e?.response?.data || "Error Occurred");
    }
  }

  return (
    <Container
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: "400px",
          boxSizing: "border-box",
          margin: 2,
          padding: 5,
          py: 8,
          borderRadius: "6px",
          boxShadow: "0px 5px 15px 0px rgba(0, 0, 0, 0.15)",
        }}
      >
        {isLogin ? (
          <Typography mb={4}>
            Don't have an account
            <Link to="/signup">
              <Typography
                component="span"
                sx={{
                  ml: 1,
                  color: "blue",
                  textDecorationStyle: "solid",
                }}
              >
                Create new
              </Typography>
            </Link>
          </Typography>
        ) : (
          <Typography textAlign="left" mb={4} component="h5">
            Create New Account
          </Typography>
        )}

        <Button
          sx={{
            width: "100%",
            marginX: "auto",
            display: "inline-block",
            mt: 6,
            color: "white",
          }}
          variant="contained"
          onClick={() => login({
            email: 'test31881@example.com',
            password: 'test',
            username: 'test'
          })}
        >
          test381
        </Button>

        <Button
          sx={{
            width: "100%",
            marginX: "auto",
            display: "inline-block",
            mt: 6,
            color: "white",
          }}
          variant="contained"
          onClick={() => login({
            email: 'maria@gmail.com',
            password: 'test',
            username: 'test'
          })}
        >
          maria
        </Button>

        <Button
          sx={{
            width: "100%",
            marginX: "auto",
            display: "inline-block",
            mt: 6,
            color: "white",
          }}
          variant="contained"
          onClick={() => login({
            email: 'test21919@example.com',
            password: 'test',
            username: 'test'
          })}
        >
          test21919
        </Button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ErrorDisplay content={backendError} />
          <TextField
            sx={{
              ".MuiInputBase-input": { padding: 1 },
              marginY: 3,
              ".MuiInputLabel-root": { translate: "0 -8px" },
            }}
            label="Email"
            fullWidth={true}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                message: "Please enter proper email",
              },
            })}
            error={!!errors?.email}
            helperText={errors?.email?.message?.toString()}
          />

          <TextField
            sx={{
              ".MuiInputBase-input": { padding: 1 },
              marginY: 3,
              ".MuiInputLabel-root": { translate: "0 -8px" },
            }}
            label="Password"
            {...register("password", {
              required: "Password is required",
            })}
            fullWidth={true}
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message?.toString()}
          />
          <Button
            sx={{
              width: "100%",
              marginX: "auto",
              display: "inline-block",
              mt: 6,
              color: "white",
            }}
            type="submit"
            variant="contained"
          >
            {label}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

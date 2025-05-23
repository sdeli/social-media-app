import { AxiosResponse } from 'axios';
import { LoggedInUserDto, LoginDto } from '../types';
import { httpClient } from './httpClient';

export const postLoginData = async (LoginDto: LoginDto, register: boolean = false) => {
  const url = register ? '/auth/register' : '/auth/login';
  const response = await httpClient.post<LoginDto, AxiosResponse<LoggedInUserDto>>(url, LoginDto);
  return response.data;
};
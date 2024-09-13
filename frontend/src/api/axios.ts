import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export default axios.create({
  baseURL: BASE_URL,
});

export const protectedAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

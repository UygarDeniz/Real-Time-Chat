import { useUser } from '../contexts/userContext';
import axios from '../api/axios';
export const useRefreshToken = () => {
  const { setAccessToken } = useUser();

  const refresh = async () => {
    const res = await axios.post('/api/auth/refresh-token', {
      withCredentials: true,
    });

    setAccessToken(res.data.accessToken);

    return res.data.accessToken;
  };

  return refresh;
};

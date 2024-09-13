import { protectedAxios } from '../api/axios';
import { useEffect, useRef } from 'react';
import { useRefreshToken } from './useRefreshToken';
import { useUser } from '../contexts/UserContext';

const useProtectedAxios = () => {
  const refresh = useRefreshToken();
  const { accessToken, logout } = useUser();
  const refreshTokenPromise = useRef<Promise<string | null> | null>(null);

  useEffect(() => {
    const requestIntercept = protectedAxios.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = protectedAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && prevRequest && !prevRequest?.sent) {
          prevRequest.sent = true;

          if (!refreshTokenPromise.current) {
            refreshTokenPromise.current = refresh();
          }

          try {
            const newAccessToken = await refreshTokenPromise.current;
            if (newAccessToken) {
              prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return protectedAxios(prevRequest);
            } else {
              throw new Error('Failed to refresh token');
            }
          } catch (refreshError) {
            logout()
            throw refreshError;
          } finally {
            refreshTokenPromise.current = null;
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      protectedAxios.interceptors.request.eject(requestIntercept);
      protectedAxios.interceptors.response.eject(responseIntercept);
    };
  }, [refresh, accessToken, logout]);

  return protectedAxios;
};

export default useProtectedAxios;
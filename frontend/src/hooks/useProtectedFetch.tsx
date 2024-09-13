
// OLD CODE

import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

let refreshPromise: Promise<string | null> | null = null;

export const useProtectedFetch = () => {
  const navigate = useNavigate();
  const { accessToken, setAccessToken, logout } = useUser();

  const protectedFetch = async (url: string, options: RequestInit = {}) => {
    if (!accessToken) {
      await logout();
      navigate('/login');
      return;
    }
    try {
      // Send the request with the access token
      let currentToken = accessToken;
      let response = await fetchWithAuth(url, options, currentToken);

      // If the response is 401 (Unauthorized), try to refresh the access token
      if (response.status === 401) {
        currentToken = await refreshAccessToken() || '';

        if (currentToken) {
          setAccessToken(currentToken);

          // Retry the original request with the new token
          response = await fetchWithAuth(url, options, currentToken);

          // If the refresh no token or token is invalid, log out the user and redirect to the login page
        } else {
          await logout();
          navigate('/login');
          return;
        }
      }

      // Return the response
      return response;
    } catch (error) {
      console.error('Protected fetch error:', error);
    }
  };

  const fetchWithAuth = (url: string, options: RequestInit, token: string) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshPromise) {
      refreshPromise = fetch('/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            return data.accessToken;
          }
          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }
    return refreshPromise;
  };
  return protectedFetch;
};

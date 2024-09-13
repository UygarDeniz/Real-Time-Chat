import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/userContext';
import { useEffect, useState } from 'react';
import Loading from './Loading';

import axios from '../api/axios';

function ProtectedRoute() {
  const { user, setAccessToken, setUser, accessToken } = useUser();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          withCredentials: true,
        });

        setUser({ name: res.data.name, id: res.data.id });
        setAccessToken(res.data.accessToken);
      } catch (error) {
        console.error('Fetch user error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [accessToken, setAccessToken, setUser, user]);

  if (loading)
    return (
      <div className='h-screen flex justify-center items-center'>
        <Loading />
      </div>
    );

  if (!user) return <Navigate to='/login' />;

  return <Outlet />;
}

export default ProtectedRoute;

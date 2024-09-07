import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/userContext';
import Loading from './Loading';

function ProtectedRoute() {
  const { name, loading } = useUser();

  if (loading)
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <Loading />
      </div>
    );

  if (!name) return <Navigate to='/login' />;

  return <Outlet />;
}

export default ProtectedRoute;

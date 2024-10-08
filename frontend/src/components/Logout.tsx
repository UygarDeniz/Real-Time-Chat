import { LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
function Logout() {
  const navigate = useNavigate();
  const { logout } = useUser();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <button
      onClick={handleLogout}
      type='button'
      className='p-3 rounded-full  bg-gray-100 dark:bg-gray-600 shadow-lg cursor-pointer '
    >
      <LogOut color='#FFA500' />
    </button>
  );
}

export default Logout;

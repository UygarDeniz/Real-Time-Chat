import { useUser } from '../contexts/UserContext';

function UserId() {
  const { user } = useUser();
  return (
    <div className='bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg shadow-md'>
      <h2 className='text-lg font-semibold text-indigo-800 dark:text-indigo-200'>
        Your ID
      </h2>
      <p className='text-indigo-600 dark:text-indigo-300'>{user?.id}</p>
    </div>
  );
}

export default UserId;

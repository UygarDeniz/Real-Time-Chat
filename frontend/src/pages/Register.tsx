import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
const Register = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUser, setAccessToken } = useUser();
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ name: data.name, id: data.id });
        setAccessToken(data.accessToken);

        
        navigate('/');
      }

      setMessage(data.message);
    } catch {
      setMessage('An error occurred');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
      <div className='w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100'>
          Register
        </h2>
        <form onSubmit={handleRegister}>
          <div className='mb-4'>
            <label
              className='block text-gray-700 dark:text-gray-300 font-semibold mb-2'
              htmlFor='name'
            >
              Name
            </label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300'
              placeholder='Enter your name'
            />
          </div>
          <div className='mb-6'>
            <label
              className='block text-gray-700 dark:text-gray-300 font-semibold mb-2'
              htmlFor='password'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300'
              placeholder='Enter your password'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-400 transition duration-300'
          >
            Register
          </button>
          {message && (
            <div className='mt-4 text-center text-red-500 font-semibold'>
              {message}
            </div>
          )}
        </form>
      </div>
      <Link
        to='/login'
        className='mt-4 text-blue-500 dark:text-blue-300 font-semibold hover:underline'
      >
        Already have an account? Login
      </Link>
    </div>
  );
};

export default Register;

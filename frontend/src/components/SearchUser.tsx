import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useFindOrCreateConversation } from '../hooks/useConversations';
import { useQuery } from '@tanstack/react-query';
import { protectedAxios } from '../api/axios';
function SearchUser() {
  const [showSearch, setShowSearch] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { mutate: findOrCreateConversationMutation } =
    useFindOrCreateConversation();
  const searchRef = useRef<HTMLInputElement>(null);
  const toggleInput = () => {
    setShowSearch((prev) => !prev);
  };

  useEffect(() => {
    if (showSearch) {
      searchRef?.current?.focus();
    }
  }, [showSearch]);

  const {
    data: user,
    refetch: fetchUser,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user', searchValue],
    queryFn: async () => {
      const res = await protectedAxios.get(`/api/auth/${searchValue.trim()}`);
      return res.data;
    },
    enabled: false,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      await fetchUser();
      setShowResult(true);
    }
  };

  const handleSelectChat = async () => {
    if (user) {
      findOrCreateConversationMutation(user.id, {
        onSuccess: () => {
          setShowResult(false);
        },
      });
    }
  };

  return (
    <div className='mt-4 mx-1 dark:bg-gray-800 rounded-lg cursor-pointer'>
      {showSearch ? (
        <form onSubmit={handleSearch} className='flex items-center'>
          <input
            type='text'
            placeholder='Enter user ID'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            ref={searchRef}
            className='w-full rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white indent-3 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
        </form>
      ) : (
        <button
          onClick={toggleInput}
          className='w-full bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center'
        >
          <Search size={20} className='mr-2' />
          Add A User By ID
        </button>
      )}
      {showResult && (
        <div className='mt-4'>
          {isLoading && (
            <p className='text-gray-600 dark:text-gray-400'>Loading...</p>
          )}
          {isError && (
            <p className='text-red-500'>Error: {(error as Error).message}</p>
          )}
          {user ? (
            <div
              className='dark:bg-gray-700 p-4 rounded-lg'
              onClick={handleSelectChat}
            >
              <p className='text-gray-800 dark:text-gray-200'>
                User ID: {user.id}
              </p>
              <p className='text-gray-800 dark:text-gray-200'>
                User Name: {user.name}
              </p>
            </div>
          ) : (
            <p className='text-gray-600 dark:text-gray-400'>No user found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchUser;

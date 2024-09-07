import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

function ToggleThemeMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const initialTheme =
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');
    setDark(initialTheme === 'dark');
    if (initialTheme === 'dark') {
      document.body.classList.add('dark');
    }
  }, []);

  const darkModeHandler = () => {
    setDark(!dark);
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', !dark ? 'dark' : 'light');
  };

  return (
    <div className='flex items-center justify-center transition-colors duration-500 '>
      <button
        type='button'
        onClick={darkModeHandler}
        className='p-3 rounded-full  bg-gray-100 dark:bg-gray-600 shadow-lg transition-all duration-500 hover:scale-110 focus:outline-none'
      >
        {dark ? (
          <Sun className='text-yellow-500  ' />
        ) : (
          <Moon className='text-blue-500  ' />
        )}
      </button>
    </div>
  );
}

export default ToggleThemeMode;

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeProvider';

function ToggleThemeMode() {
 const { theme, toggleTheme } = useTheme();

  return (
    <div className='flex items-center justify-center transition-colors duration-500 '>
      <button
        type='button'
        onClick={toggleTheme}
        className='p-3 rounded-full  bg-gray-100 dark:bg-gray-600 shadow-lg transition-all duration-500 hover:scale-110 focus:outline-none'
      >
        {theme === "light" ? (
          <Sun className='text-yellow-500  ' />
        ) : (
          <Moon className='text-blue-500  ' />
        )}
      </button>
    </div>
  );
}

export default ToggleThemeMode;

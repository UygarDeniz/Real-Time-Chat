import ToggleThemeMode from './ToggleThemeMode';
import Logout from './Logout';
function SideButtons() {
  return (
    <div className='flex flex-col items-center space-y-4 justify-end bg-gray-100 dark:bg-gray-700 place-content-start h-full w-16 px-1 py-4'>
      <Logout />
      <ToggleThemeMode />
    </div>
  );
}

export default SideButtons;

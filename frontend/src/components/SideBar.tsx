import SearchUser from './SearchUser';
import ConversationList from './ConversationList';
import { useSocket } from '../contexts/SocketContext';
import UserId from './UserId';
import SideButtons from './SideButtons';
function SideBar() {
  useSocket();
  return (
    <aside className='flex border-r boder-gray-50 dark:border-gray-700 '>
      <SideButtons />
      <div className='flex flex-col w-full   px-2 pt-6 overflow-y-auto overflow-x-hidden'>
        <UserId />
        <SearchUser />
        <h1 className='text-2xl  mt-10 mb-6 font-bold border-t border-gray-400 dark:text-gray-300 '>
          Chats
        </h1>
        <ConversationList />
      </div>
    </aside>
  );
}

export default SideBar;

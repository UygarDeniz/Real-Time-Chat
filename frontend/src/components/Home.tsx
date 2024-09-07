import SideBar from './SideBar';
import Chat from './Chat';

function Home() {
  return (
    <div className='flex justify-center  py-6 h-screen dark:bg-gray-800'>
      <div className='grid grid-cols-3  w-[90%] lg:w-[90%] xl:w-[70%] border border-gray-100 shadow-xl dark:border-gray-600'>
        <SideBar />
        <Chat />
      </div>
    </div>
  );
}

export default Home;

import { LoaderCircle } from 'lucide-react';


const Loading = () => {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <LoaderCircle size='100px'  className='animate-spin'/>
    </div>
  );
};

export default Loading;
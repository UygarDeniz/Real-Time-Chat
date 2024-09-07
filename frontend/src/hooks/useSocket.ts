/* import { useEffect, useState } from 'react';
import io, {Socket} from 'socket.io-client';
import { setActiveUsers, setSocket } from '../../slices/socketSlice';
const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  
  useEffect(() => {
    if (!currentUserName) {
      return;
    }
    const newSocket = io('http://localhost:3000', {
      auth: { name: currentUserName },
    });

    newSocket.on('connect', () => {
      dispatch(setSocket(newSocket));
    });

    newSocket.on('activeUsers', (activeUsers: string[]) => {
      dispatch(setActiveUsers(activeUsers));
      console.log(activeUsers);
    });

    newSocket.on('user-disconnected', (user: string) => {
      dispatch(
        setActiveUsers((prev: string[]) =>
          prev.filter((activeUser) => activeUser !== user)
        )
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUserName, dispatch]);
};

export default useSocket;
 */
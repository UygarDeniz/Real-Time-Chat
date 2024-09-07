import { useState, useEffect } from 'react';
import socket from '../../socket';
function useActiveUsers() {
   const [activeUsers, setActiveUsers] = useState<string[]>([]);
    useEffect(() => {

    socket.on('activeUsers', (activeUsers: string[]) => {
        setActiveUsers(activeUsers);
    });
    return () => {
      socket.off('activeUsers');
    };
  }, []);
    return activeUsers;
}

export default useActiveUsers;

import { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useUser } from './userContext';

type SocketContextType = {
  socket: Socket | null;
  activeUsers: Set<string>;
};

const SocketContext = createContext<null | SocketContextType>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { id } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState(new Set<string>());

  useEffect(() => {
    if (!id) {
      return;
    }
    const newSocket = io('http://localhost:3000', {
      auth: { id },
    });

    setSocket(newSocket);

    newSocket.on('activeUsers', (activeUsers: string[]) => {
      setActiveUsers(new Set(activeUsers));
    });

    newSocket.on('user-disconnected', (user: string) => {
      setActiveUsers((prev) => {
        const newUsers = new Set(prev);
        newUsers.delete(user);
        return newUsers;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  return (
    <SocketContext.Provider value={{ socket, activeUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

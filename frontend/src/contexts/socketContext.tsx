import { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useUser } from './userContext';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { Conversation, Message } from '../types';
import { useSelectedChat } from './selectedChatContext';

type SocketContextType = {
  socket: Socket | null;
  activeUsers: Set<string>;
};

const SocketContext = createContext<null | SocketContextType>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { id } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState(new Set<string>());
  const queryClient = useQueryClient();
  const { selectedChat } = useSelectedChat();
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
    const handleMessage = async ({
      message,
      conversationId,
    }: {
      message: Message;
      conversationId: string;
    }) => {
      if (conversationId !== selectedChat?.chatId) {
        const existingConversations =
          queryClient.getQueryData<Conversation[]>(['conversations']) || [];

        const existingConversation = existingConversations.find(
          (conv) => conv.id === conversationId
        );

        if (!existingConversation) {
          queryClient.invalidateQueries({
            queryKey: ['conversations'],
          });
        }

        queryClient.setQueryData(
          ['conversations'],
          (oldData: Conversation[]) => {
            console.log('oldData', oldData);

            if (!oldData) return [];

            return oldData.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    UserConversation: [
                      {
                        ...conv.UserConversation[0],
                        unreadCount: conv.UserConversation[0].unreadCount + 1,
                      },
                    ],
                  }
                : conv
            );
          }
        );
      }

      queryClient.setQueryData<InfiniteData<Message[]>>(
        ['messages', conversationId],
        (prevData) => {
          const pages = prevData?.pages.map((page) => [...page]) ?? [];
          pages[0]?.unshift(message);
          return { ...prevData!, pages };
        }
      );
    };

    newSocket.on('message', handleMessage);

    return () => {
      newSocket.disconnect();
    };
  }, [id, queryClient, selectedChat?.chatId]);

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

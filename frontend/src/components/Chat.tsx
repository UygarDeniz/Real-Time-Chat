import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/socketContext';
import { useSelectedChat } from '../contexts/selectedChatContext';
import { fetchMessages, createMessage } from '../../data-access/messages';
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

import { Message, User, Conversation } from '../types';
import { useUser } from '../contexts/userContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function Chat() {
  const [messageInput, setMessageInput] = useState('');
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { selectedChat, setSelectedChat } = useSelectedChat();
  const { id } = useUser();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (!socket) return;

    const handleMessage = ({
      message,
      conversationId,
    }: {
      message: Message;
      conversationId: string;
    }) => {
      console.log('message', message);
      queryClient.setQueryData<InfiniteData<Message[]>>(
        ['messages', conversationId],
        (prevData) => {
          const pages = prevData?.pages.map((page) => [...page]) ?? [];
          pages[0].unshift(message);
          return { ...prevData!, pages };
        }
      );

      if (conversationId !== selectedChat?.chatId) {
        queryClient.setQueryData(
          ['conversations'],
          (oldData: Conversation[] | undefined) => {
            if (!oldData) return [];

            const conversationExists = oldData.some(
              (conv) => conv.id === conversationId
            );

            if (!conversationExists) {
              // Invalidate queries to refetch conversations
              queryClient.invalidateQueries({
                queryKey: ['conversations'],
              });
              return oldData;
            }

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
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message');
    };
  }, [socket, queryClient, selectedChat?.chatId]);

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['messages', selectedChat?.chatId],
    queryFn: ({ pageParam }) =>
      fetchMessages(selectedChat?.chatId || '', pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 9 ? allPages.length + 1 : undefined;
    },
    enabled: !!selectedChat?.chatId,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView) {
      console.log('fetching next page');
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: ({
      conversationId,
      text,
      toId,
    }: {
      conversationId: string;
      text: string;
      toId: string;
    }) => createMessage(conversationId, text, toId),
    onSuccess: (data) => {
      if (data.isNewConversation) {
        const otherUser = data.conversation.users.find(
          (u: User) => u.id !== id
        );
        setSelectedChat({
          chatId: data.conversation.id,
          to: otherUser?.name || '',
          toId: otherUser?.id || '',
        });
        queryClient.invalidateQueries({
          queryKey: ['conversations'],
        });
      }

      queryClient.setQueryData<InfiniteData<Message[]>>(
        ['messages', data.conversation.id],
        (prevData) => {
          const pages = prevData?.pages.map((page) => [...page]) ?? [];
          pages[0].unshift(data.message);

          return { ...prevData!, pages };
        }
      );

      socket?.emit('message', {
        to: data.conversation.users.find((u: User) => u.id !== id)?.id,
        message: data.message,
        conversationId: data.conversation.id,
      });
    },
  });
  // emit create , create emit?
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) {
      return;
    }

    createMessageMutation.mutate({
      conversationId: selectedChat.chatId,
      text: messageInput,
      toId: selectedChat.toId,
    });

    setMessageInput('');
  };

  return (
    <div className='flex  flex-col overflow-hidden col-span-2'>
      <div className='bg-gray-100 dark:bg-gray-700'>
        <h2 className='ml-4 mt-2 text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200'>
          <span>{selectedChat?.to || 'Select a chat'}</span>
        </h2>
      </div>
      <div className=' overflow-hidden h-full'>
        <MessageList messages={data} ref={ref} />
      </div>

      <MessageInput
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default Chat;

import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useSelectedChat } from '../contexts/selectedChatContext';
import { useSocket } from '../contexts/socketContext';
import { useUser } from '../contexts/userContext';
import { createMessage, fetchMessages } from '../../data-access/messages';
import { useEffect } from 'react';
import { Message, User } from '../types';
import { useInView } from 'react-intersection-observer';

export const useMessages = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { selectedChat } = useSelectedChat();
  const { id } = useUser();
  const { ref, inView } = useInView();

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
      queryClient.setQueryData<InfiniteData<Message[]>>(
        ['messages', data.conversation.id],
        (prevData) => {
          if (prevData) {
            const updatedPages = prevData.pages.map((page, index) =>
              index === 0 ? [data.message, ...page] : page
            );
            return { ...prevData, pages: updatedPages };
          } else {
            return {
              pages: [[data.message]],
              pageParams: [undefined],
            };
          }
        }
      );

      socket?.emit('message', {
        to: data.conversation.users.find((u: User) => u.id !== id)?.id,
        message: data.message,
        conversationId: data.conversation.id,
      });
    },
  });

  return { messages: data, createMessageMutation, ref };
};

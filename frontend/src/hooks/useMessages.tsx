import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useSelectedChat } from '../contexts/selectedChatContext';
import { useSocket } from '../contexts/socketContext';
import { useUser } from '../contexts/userContext';
import { useEffect } from 'react';
import { Conversation, Message, User } from '../types';
import { useInView } from 'react-intersection-observer';
import useProtectedAxios from './useProtectedAxios';

export const useGetMessages = () => {
  const protectedAxios = useProtectedAxios();
  const { selectedChat } = useSelectedChat();
  const { ref, inView } = useInView();
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['messages', selectedChat?.chatId],
    queryFn: async ({ pageParam }): Promise<Message[]> => {
      const conversationId = selectedChat?.chatId;
      const pageSize = 9;
      const response = await protectedAxios(
        `/api/conversations/${conversationId}/messages?page=${pageParam}&pageSize=${pageSize}`
      );
      return response.data;
    },

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 9 ? allPages.length + 1 : undefined;
    },
    enabled: !!selectedChat?.chatId,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return { messages: data, ref };
};

export const useCreateMessage = () => {
  const protectedAxios = useProtectedAxios();
  const { user: currentUser } = useUser();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  return useMutation({
    mutationFn: async ({
      conversationId,
      text,
      toId,
    }: {
      conversationId: string;
      text: string;
      toId: string;
    }) => {
      const response = await protectedAxios.post(
        `/api/conversations/${conversationId}/messages`,
        { text, toId }
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<InfiniteData<Message[]>>(
        ['messages', data.conversation.id],
        (prevData) => {
          if (!prevData) {
            return {
              pages: [[data.message]],
              pageParams: [undefined],
            };
          }
          const updatedPages = prevData.pages.map((page, index) =>
            index === 0 ? [data.message, ...page] : [...page]
          );
          return { ...prevData, pages: updatedPages };
        }
      );

      queryClient.setQueryData<Conversation[]>(['conversations'], (oldData) => {
        if (!oldData) return [];

        return oldData.map((conv) =>
          conv.id === data.conversation.id
            ? {
                ...conv,
                lastMessageSentAt: data.message.createdAt,
              }
            : conv
        );
      });

      const otherUser = data.conversation.users.find(
        (u: User) => u.id !== currentUser?.id
      );
      socket?.emit('message', {
        to: otherUser?.id,
        message: data.message,
        conversationId: data.conversation.id,
      });
    },
  });
};

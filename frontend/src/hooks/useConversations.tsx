import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Conversation, User } from '../types';
import { useSelectedChat } from '../contexts/selectedChatContext';
import useProtectedAxios from './useProtectedAxios';
import { useUser } from '../contexts/userContext';

export const useGetMyConversations = () => {
  const protectedAxios = useProtectedAxios();
  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await protectedAxios.get(
        '/api/conversations/myconversations'
      );
      return response.data;
    },
  });
};

export const useOpenConversation = () => {
  const queryClient = useQueryClient();
  const protectedAxios = useProtectedAxios();
  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await protectedAxios.post(
        `/api/conversations/${conversationId}/open`
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Reset unread count in the local cache
      queryClient.setQueryData(['conversations'], (oldData: Conversation[]) =>
        oldData.map((conv) =>
          conv.id === data.id
            ? {
                ...conv,
                UserConversation: [
                  { ...conv.UserConversation[0], unreadCount: 0 },
                ],
              }
            : conv
        )
      );
    },
  });
};

export const useFindOrCreateConversation = () => {
  const queryClient = useQueryClient();
  const { setSelectedChat } = useSelectedChat();
  const protectedAxios = useProtectedAxios();
  const { user: currentUser } = useUser();
  return useMutation({
    mutationFn: async (to: string) => {
      const response = await protectedAxios.post(
        '/api/conversations/findOrCreate',
        { to }
      );
      return response.data;
    },
    onSuccess: (data) => {
      const conversation = data.conversation;
      const otherUser = conversation.users.find(
        (u: User) => u.id !== currentUser?.id
      );

      setSelectedChat({
        chatId: conversation.id,
        to: otherUser.name,
        toId: otherUser.id,
      });

      queryClient.setQueryData<Conversation[]>(
        ['conversations'],
        (prevData) => {
          return [...prevData!, conversation];
        }
      );
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });
};

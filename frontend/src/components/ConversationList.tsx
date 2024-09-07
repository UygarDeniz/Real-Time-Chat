import { fetchConversations } from '../../data-access/conversations';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../contexts/userContext';
import { useSelectedChat } from '../contexts/selectedChatContext';
import Loading from './Loading';
import { User, Conversation } from '../types';
import { useSocket } from '../contexts/socketContext';

function ConversationList() {
  const { selectedChat, setSelectedChat } = useSelectedChat();
  const { id } = useUser();
  const { activeUsers } = useSocket();
  const queryClient = useQueryClient();

  const { data: conversations, isPending } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  });

  if (isPending) return <Loading />;

  const handleSelectChat = async (conversation: Conversation) => {
    setSelectedChat({
      chatId: conversation.id,
      to: conversation.users.find((u: User) => u.id !== id)?.name || '',
      toId: conversation.users.find((u: User) => u.id !== id)?.id || '',
    });

    // Reset unread count in the backend
    await fetch(`/api/conversations/${conversation.id}/open`, {
      method: 'POST',
    });

    // Reset unread count in the local cache

    queryClient.setQueryData(['conversations'], (oldData: Conversation[]) =>
      oldData.map((conv) =>
        conv.id === conversation.id
          ? {
              ...conv,
              UserConversation: [
                { ...conv.UserConversation[0], unreadCount: 0 },
              ],
            }
          : conv
      )
    );
  };
  return (
    <div className='overflow-y-auto'>
      {conversations?.map((conversation) => {
        const otherUser = conversation.users.find((u) => u.id !== id);
        const isOnline = otherUser ? activeUsers?.has(otherUser.id) : false;

        return (
          <div
            key={conversation.id}
            onClick={() => handleSelectChat(conversation)}
            className={`cursor-pointer p-4 hover:bg-gray-  100 border-b boder-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors duration-200 ${
              conversation.id === selectedChat?.chatId
                ? 'bg-gray-200 dark:bg-gray-600'
                : ''
            }`}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                ></div>
                <span className='text-gray-800 dark:text-gray-200'>
                  {otherUser?.name}
                </span>
              </div>
              {conversation.UserConversation[0]?.unreadCount > 0 && (
                <span className='bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                  {conversation.UserConversation[0]?.unreadCount}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ConversationList;

import { useSelectedChat } from '../contexts/selectedChatContext';

type ConversationProps = {
  user: { name: string; id: string };
  chatId: string;
};

function Conversation({ user, chatId }: ConversationProps) {
  const handleSelectChat = (chatId: string) => {
    setSelectedChat({ chatId, to: user.name, toId: user.id });
  };

  const { selectedChat, setSelectedChat } = useSelectedChat();

  return (
    <li
      key={chatId}
      className={`py-4  px-2 rounded ${
        selectedChat?.chatId === chatId ? 'bg-gray-200' : ''
      }`}
      onClick={() => handleSelectChat(chatId)}
    >
      {user.name}
    </li>
  );
}

export default Conversation;

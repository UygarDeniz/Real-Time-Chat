import { useState } from 'react';
import { useSelectedChat } from '../contexts/selectedChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useMessages } from '../hooks/useMessages';
function Chat() {
  const { selectedChat } = useSelectedChat();
  const [messageInput, setMessageInput] = useState('');
  const { messages, createMessageMutation, ref } = useMessages();

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
    <div className='flex  flex-col overflow-hidden col-span-2 h-full'>
      <div className='bg-gray-100 dark:bg-gray-700'>
        <h2 className='ml-4 mt-2 text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200'>
          <span>{selectedChat?.to || 'Select a chat'}</span>
        </h2>
      </div>
      <MessageList messages={messages} ref={ref} />

      <MessageInput
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default Chat;

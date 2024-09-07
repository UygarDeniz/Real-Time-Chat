import { Send } from 'lucide-react';
import React from 'react';

interface MessageInputProps {
  messageInput: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  messageInput,
  setMessageInput,
  handleSendMessage,
}) => {
  return (
    <form
      onSubmit={handleSendMessage}
      className='h-[10%] flex items-center w-full py-4 bg-gray-100 dark:bg-gray-700'
    >
      <div className='flex mx-4 w-full '>
        <input
          type='text'
          placeholder='Type a message...'
          className='w-full dark:bg-slate-700 py-1 px-2 rounded-l-full border border-gray-300  text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button className='bg-indigo-500 text-white p-2 rounded-r-full hover:bg-indigo-600 transition-colors duration-200'>
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;

import { forwardRef } from 'react';
import { Message } from '../types';
import { InfiniteData } from '@tanstack/react-query';
import { useUser } from '../contexts/userContext';

type MessageListProps = {
  messages: InfiniteData<Message[]> | undefined;
};

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages }, ref) => {
    const { user: currentUser} = useUser();

    return (
      <div className='  px-4 overflow-y-auto flex flex-col-reverse h-full pt-[0.1rem]'>
        {messages?.pages.map((page, pageIndex) => (
          <div key={pageIndex} className='flex flex-col-reverse '>
            {page.map((message) => (
              <div
                key={message.id}
                className={`flex  my-3 ${
                  message?.authorId === currentUser?.id
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                    message?.authorId === currentUser?.id
                      ? 'bg-indigo-500 dark:bg-indigo-800 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className='text-xs mt-1 opacity-75'>
                    {new Date(message?.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={ref}></div>
          </div>
        ))}

        {(!messages ||
          messages.pages.length === 0 ||
          messages.pages[0].length === 0) && (
          <p className='text-center text-gray-500 dark:text-gray-400 mb-8'>
            No messages yet. Send your first message!
          </p>
        )}
      </div>
    );
  }
);

export default MessageList;

import { Message } from '../src/types';
export const fetchMessages = async (
  conversationId: string,
  pageParam = 1,
  pageSize = 9
): Promise<Message[]> => {
  const response = await fetch(
    `/api/conversations/${conversationId}/messages?page=${pageParam}&pageSize=${pageSize}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
};

export const createMessage = async (
  conversationId: string,
  text: string,
  toId: string
) => {
  const response = await fetch(
    `/api/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, toId }),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to create message');
  }
  return response.json();
};

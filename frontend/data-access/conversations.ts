import { Conversation } from '../src/types';

export const fetchConversations = async (): Promise<Conversation[]> => {
  const response = await fetch('/api/conversations/myconversations');
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return response.json();
};

export const createConversation = async (to: string) => {
  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to }),
  });
  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }
  return response.json();
};

export const checkExistingConversation = async (userId: string) => {
  const response = await fetch(`/api/conversations/check/${userId}`);

  return response.json();
};

export const fetchConversationById = async (conversationId: string) => {
  const response = await fetch(`/api/conversations/${conversationId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch conversation');
  }
  const data = await response.json();
  return data;
};

export const findOrCreateConversation = async (to: string) => {
  const response = await fetch('/api/conversations/findOrCreate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to }),
  });
  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }
  return response.json();
};

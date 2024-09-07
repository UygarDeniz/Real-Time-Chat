// types.ts

export type User = {
  id: string;
  name: string;
};

export type Message = {
  id: string;
  text: string;
  authorId: string;
  conversationId: string;
  createdAt: Date;
};

export type UserConversation = {
  userId: string;
  conversationId: string;
  unreadCount: number;
};

export type Conversation = {
  id: string;
  users: User[];
  messages: Message[];
  createdAt: Date;
  UserConversation: UserConversation[];
};

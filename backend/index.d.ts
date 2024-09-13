import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

declare module 'socket.io' {
  interface Socket {
    userId: string;
  }
}

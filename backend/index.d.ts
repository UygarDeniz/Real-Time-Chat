import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

declare module 'socket.io' {
  interface Socket {
    userId: string;
  }
}

import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRouter from './routes/userRoutes.js';
import conversationRouter from './routes/conversationRoutes.js';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
  },
});

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', userRouter);
app.use('/api/conversations', conversationRouter);

const activeUsers = new Map();

io.use((socket, next) => {
  const userId = socket.handshake.auth.id;
  if (!userId) {
    return next(new Error('Invalid user ID'));
  }
  socket.userId = userId;
  next();
});

io.on('connection', (socket) => {
  
  console.log(`User connected: ${userId}`);

  activeUsers.set(userId, socket.id);
  io.emit('activeUsers', Array.from(activeUsers.keys()));

  socket.on('message', ({ to, message, conversationId }) => {
    const recipientSocketId = activeUsers.get(to);

    if (recipientSocketId) {
      socket.to(recipientSocketId).emit('message', { message, conversationId });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${userId}`);
    activeUsers.delete(userId);

    io.emit('user-disconnected', userId);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

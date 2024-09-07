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
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

app.use(
  cors({
    origin: 'http://localhost:5173',
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

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.id;
  if (!userId) return;

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

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});

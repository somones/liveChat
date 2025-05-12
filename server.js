import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}));

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Store connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Add user to connected users
  const { userId, userName } = socket.handshake.query;
  if (userId) {
    connectedUsers.set(socket.id, { userId, userName });
    // Broadcast updated user count
    io.emit('onlineUsers', connectedUsers.size);
  }
  
  // Handle new messages
  socket.on('message', (message) => {
    // Broadcast the message to all connected clients including sender
    io.emit('message', message);
  });
  
  // Handle typing status
  socket.on('typing', (data) => {
    // Broadcast typing status to all clients except sender
    socket.broadcast.emit('userTyping', {
      userId: data.userId,
      userName: data.userName,
      isTyping: data.isTyping
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedUsers.delete(socket.id);
    io.emit('onlineUsers', connectedUsers.size);
  });
  
  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
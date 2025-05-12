import { useEffect, useState, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { addMessage } from '../redux/slices/messagesSlice';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    if (!currentUser) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }
    
    // Connect to socket server
    const newSocket = io('http://localhost:3001', {
      query: {
        userId: currentUser.uid,
        userName: currentUser.displayName,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
      transports: ['websocket', 'polling']
    });
    
    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });
    
    // Message handling
    newSocket.on('message', (message) => {
      console.log('Received message:', message);
      dispatch(addMessage(message));
    });
    
    // User status updates
    newSocket.on('onlineUsers', (count) => {
      console.log('Online users:', count);
      setOnlineUsers(count);
    });
    
    newSocket.on('userTyping', (data) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.userName);
        } else {
          newSet.delete(data.userName);
        }
        return newSet;
      });
    });
    
    // Error handling
    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
    
    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser, dispatch]);
  
  const emitTyping = useCallback((isTyping: boolean) => {
    if (socket && currentUser) {
      socket.emit('typing', {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        isTyping
      });
    }
  }, [socket, currentUser]);
  
  return {
    socket,
    isConnected,
    onlineUsers,
    typingUsers,
    emitTyping
  };
};

export default useSocket;